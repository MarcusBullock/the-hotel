import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useUpdateCabin } from "./useUpdateCabin";

function CreateCabinForm({ cabinToEdit = {} }) {
    const { id: editId, ...editValues } = cabinToEdit;

    const isEditSession = Boolean(editId);

    const { register, handleSubmit, reset, getValues, formState } = useForm({
        defaultValues: isEditSession ? editValues : {},
    });
    const { errors } = formState;

    const { isLoading: isCreating, createCabin } = useCreateCabin();
    const { isLoading: isUpdating, updateCabin } = useUpdateCabin();

    const isBusy = isUpdating || isCreating;

    function onSubmit(data) {
        const image =
            typeof data.image === "string" ? data.image : data.image[0];

        if (isEditSession)
            updateCabin(
                {
                    newCabinData: {
                        ...data,
                        image,
                    },
                    id: editId,
                },
                {
                    onSuccess: () => reset(),
                }
            );
        else
            createCabin(
                { ...data, image },
                {
                    onSuccess: () => reset(),
                }
            );
    }

    function onError(errors) {
        //  console.log(errors);
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormRow label="Cabin name" errorMessage={errors?.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isBusy}
                    {...register("name", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                errorMessage={errors?.maxCapacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isBusy}
                    {...register("maxCapacity", {
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Capacity should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label="Regular price"
                errorMessage={errors?.regularPrice?.message}
            >
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isBusy}
                    {...register("regularPrice", {
                        required: "This field is required",
                        min: {
                            value: 1,
                            message: "Price should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Discount" errorMessage={errors?.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    defaultValue={0}
                    disabled={isBusy}
                    {...register("discount", {
                        required: "This field is required",
                        validate: (value) =>
                            value <= Number(getValues().regularPrice) ||
                            "Discount should be less than the regular price",
                    })}
                />
            </FormRow>

            <FormRow
                label="Description"
                errorMessage={errors?.description?.message}
            >
                <Textarea
                    type="number"
                    id="description"
                    disabled={isBusy}
                    defaultValue=""
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo">
                <FileInput
                    id="image"
                    disabled={isBusy}
                    accept="image/*"
                    {...register("image", {
                        required: isEditSession ? false : "A photo is required",
                    })}
                />
            </FormRow>

            <FormRow>
                <Button disabled={isBusy} variation="secondary" type="reset">
                    Cancel
                </Button>
                <Button disabled={isBusy}>
                    {isEditSession ? "Update" : "Create new"} cabin
                </Button>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
