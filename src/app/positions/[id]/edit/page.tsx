"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Container, Title, Paper, Loader, Text } from "@mantine/core"

import { useSelector, useDispatch } from "react-redux"


import PositionForm from "../../../../../component/position-form"
import { fetchPositions } from "../../../../../lib/features/positions/positionSlice"
import { AppDispatch, RootState } from "../../../../../lib/store"

export default function EditPositionPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const id = params?.id as string

  const { positions, status } = useSelector((state: RootState) => state.positions)
  const position = positions.find((p) => p.id === Number.parseInt(id))

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPositions())
    }
  }, [status, dispatch])

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
      <Title order={2} mb="lg">
        Edit Position: {position.name}
      </Title>
      <Paper p="md" withBorder>
        <PositionForm positions={positions} initialData={position} />
      </Paper>
    </Container>
  )
}

