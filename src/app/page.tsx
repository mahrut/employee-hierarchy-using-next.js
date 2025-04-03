"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"


import { Container, Title, Group, Button, Loader } from "@mantine/core"
import { useRouter } from "next/navigation"

import { IconPlus } from "@tabler/icons-react"
import PositionTree from "../../component/position-tree"
import { fetchPositions } from "../../lib/features/positions/positionSlice"
import { AppDispatch, RootState } from "../../lib/store"

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { positions, status, error } = useSelector((state: RootState) => state.positions)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPositions())
    }
  }, [status, dispatch])

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Employee Hierarchy</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => router.push("/positions/new")}>
          Add Position
        </Button>
      </Group>

      {status === "loading" && (
        <div className="flex justify-center py-10">
          <Loader size="lg" />
        </div>
      )}

      {status === "failed" && <div className="p-4 bg-red-50 text-red-700 rounded-md">Error: {error}</div>}

      {status === "succeeded" && positions.length === 0 && (
        <div className="p-8 text-center bg-gray-100 rounded-lg">
          <p className="text-gray-600 mb-4">No positions found. Start by adding a root position like CEO.</p>
          <Button onClick={() => router.push("/positions/new")}>Add Root Position</Button>
        </div>
      )}

      {status === "succeeded" && positions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PositionTree positions={positions} />
        </div>
      )}
    </Container>
  )
}

