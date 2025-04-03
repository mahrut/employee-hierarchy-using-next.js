"use client"

import { Container, Title, Paper } from "@mantine/core"

import { useSelector } from "react-redux"

import PositionForm from "../../../../component/position-form"
import { RootState } from "../../../../lib/store"

export default function NewPositionPage() {
  const { positions } = useSelector((state: RootState) => state.positions)

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        Add New Position
      </Title>
      <Paper p="md" withBorder>
        <PositionForm positions={positions} />
      </Paper>
    </Container>
  )
}

