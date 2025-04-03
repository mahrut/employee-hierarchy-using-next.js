import Link from "next/link"
import { Button, Container, Title, Text } from "@mantine/core"

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen text-center py-20">
      <Title order={1} size="3rem" mb="md">
        404
      </Title>
      <Title order={2} mb="xl">
        Page Not Found
      </Title>
      <Text mb="xl" size="lg" color="dimmed">
        The page you are looking for doesn't exist or has been moved.
      </Text>
      <Button component={Link} href="/" size="lg">
        Return to Home
      </Button>
    </Container>
  )
}

