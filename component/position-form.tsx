"use client"

import { useForm } from "react-hook-form"
import { TextInput, Textarea, Button, Select, Group, Stack } from "@mantine/core"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch } from "../lib/store"
import { Position } from "../lib/type"
import { addPosition, updatePosition } from "../lib/features/positions/positionSlice"

interface PositionFormProps {
  positions: Position[]
  initialData?: Position
}

type FormData = {
  name: string
  description: string
  parentId: number | null
}

export default function PositionForm({ positions, initialData }: PositionFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          parentId: initialData.parentId || null,
        }
      : {
          name: "",
          description: "",
          parentId: null,
        },
  })

  // Create parent position options for select
  const parentOptions = positions
    .filter((p) => !initialData || p.id !== initialData.id)
    .map((p) => ({
      value: p.id.toString(),
      label: p.name,
    }))

  // Add "None" option for root positions
  parentOptions.unshift({ value: "", label: "None (Root Position)" })

  const onSubmit = async (data: FormData) => {
    if (initialData) {
      await dispatch(
        updatePosition({
          id: initialData.id,
          name: data.name,
          description: data.description || "",
          parentId: data.parentId,
        }),
      )
    } else {
      await dispatch(
        addPosition({
          name: data.name,
          description: data.description || "",
          parentId: data.parentId,
        }),
      )
    }
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack >
        <TextInput
          label="Position Name"
          placeholder="e.g. CEO, CTO, Project Manager"
          required
          error={errors.name && "Position name is required"} // Manually handled error message
          {...register("name")}
        />

        <Textarea
          label="Description"
          placeholder="Describe the responsibilities of this position"
          minRows={3}
          {...register("description")}
          error={errors.description && "Description is required"} // Manually handled error message
        />

        <Select
          label="Reports To"
          placeholder="Select parent position"
          data={parentOptions}
          value={watch("parentId")?.toString() || ""}
          onChange={(value) => setValue("parentId", value ? Number.parseInt(value) : null)}
          error={errors.parentId && "Invalid parent position"} // Manually handled error message
        />

        <Group >
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {initialData ? "Update Position" : "Create Position"}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
