"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Text, UnstyledButton, Collapse, Group } from "@mantine/core"
import { IconChevronRight, IconChevronDown } from "@tabler/icons-react"
import { Position } from "../lib/type"

interface PositionNodeProps {
  position: Position
  positions: Position[]
  level: number
}

function PositionNode({ position, positions, level }: PositionNodeProps) {
  const [opened, setOpened] = useState(true)
  const router = useRouter()

  const children = positions.filter((p) => p.parentId === position.id)
  const hasChildren = children.length > 0

  const handleClick = () => {
    router.push(`/positions/${position.id}`)
  }

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpened(!opened)
  }

  return (
    <div>
      <Group
        
        className={`py-2 px-3 rounded hover:bg-gray-100 cursor-pointer ${level === 0 ? "font-bold" : ""}`}
        onClick={handleClick}
      >
        <div style={{ width: level * 20 }} />

        {hasChildren && (
          <UnstyledButton onClick={toggleCollapse}>
            {opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
          </UnstyledButton>
        )}

        {!hasChildren && <div style={{ width: 16 }} />}

        <Text>{position.name}</Text>
      </Group>

      {hasChildren && (
        <Collapse in={opened}>
          {children.map((child) => (
            <PositionNode key={child.id} position={child} positions={positions} level={level + 1} />
          ))}
        </Collapse>
      )}
    </div>
  )
}

interface PositionTreeProps {
  positions: Position[]
}

export default function PositionTree({ positions }: PositionTreeProps) {
  // Find root positions (those without a parent)
  const rootPositions = positions.filter((p) => !p.parentId)

  return (
    <div>
      {rootPositions.map((position) => (
        <PositionNode key={position.id} position={position} positions={positions} level={0} />
      ))}
    </div>
  )
}

