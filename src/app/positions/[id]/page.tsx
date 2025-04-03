"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Container, Title, Paper, Group, Button, Loader, Text, Stack, Divider } from "@mantine/core"
import { useSelector, useDispatch } from "react-redux"


import { IconEdit, IconTrash, IconArrowLeft } from "@tabler/icons-react"
import { modals } from "@mantine/modals"
import { AppDispatch, RootState } from "../../../../lib/store"
import { deletePosition, fetchPositions } from "../../../../lib/features/positions/positionSlice"

export default function PositionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const id = params?.id as string

  const { positions, status } = useSelector((state: RootState) => state.positions)
  const position = positions.find((p) => p.id === Number.parseInt(id))
  const parentPosition = position?.parentId ? positions.find((p) => p.id === position.parentId) : null

  const childPositions = positions.filter((p) => p.parentId === Number.parseInt(id))

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPositions())
    }
  }, [status, dispatch])

  const handleDelete = () => {
    modals.openConfirmModal({
      title: "Delete Position",
      children: (
        <Text size="sm">Are you sure you want to delete this position? This will also delete all child positions.</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await dispatch(deletePosition(Number.parseInt(id)))
        router.push("/")
      },
    })
  }

  if (status === "loading") {
    return (
      <Container size="md" py="xl" className="flex justify-center">
        <Loader size="lg" />
      </Container>
    )
  }

  if (!position) {
    return (
      <Container size="md" py="xl">
        <Text color="red">Position not found</Text>
      </Container>
    )
  }

  return (
    <Container size="md" py="xl">
      <Group mb="md">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => router.push("/")}>
          Back to Hierarchy
        </Button>
      </Group>

      <Paper p="lg" withBorder mb="xl">
        <Group >
          <Title order={2}>{position.name}</Title>
          <Group>
            <Button
              variant="outline"
              leftSection={<IconEdit size={16} />}
              onClick={() => router.push(`/positions/${id}/edit`)}
            >
              Edit
            </Button>
            <Button color="red" variant="outline" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Group>

        <Divider my="md" />

        <Stack gap="md">
          <div>
            <Text  size="sm" color="dimmed">
              Description
            </Text>
            <Text>{position.description || "No description provided"}</Text>
          </div>

          {parentPosition && (
            <div>
              <Text  size="sm" color="dimmed">
                Reports To
              </Text>
              <Text>{parentPosition.name}</Text>
            </div>
          )}

          {childPositions.length > 0 && (
            <div>
              <Text  size="sm" color="dimmed" mb="xs">
                Direct Reports
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {childPositions.map((child) => (
                  <Button
                    key={child.id}
                    variant="light"
                    fullWidth
                    onClick={() => router.push(`/positions/${child.id}`)}
                  >
                    {child.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

