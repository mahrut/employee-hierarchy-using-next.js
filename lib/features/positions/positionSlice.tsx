import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { Position } from "../../type"


// Mock data for the application
const mockPositions: Position[] = [
  { id: 1, name: "CEO", description: "Chief Executive Officer", parentId: null },
  { id: 2, name: "CTO", description: "Chief Technology Officer", parentId: 1 },
  { id: 3, name: "CFO", description: "Chief Financial Officer", parentId: 1 },
  { id: 4, name: "COO", description: "Chief Operating Officer", parentId: 1 },
  { id: 5, name: "HR", description: "Human Resources", parentId: 1 },
  { id: 6, name: "Project Manager", description: "Technology Project Manager", parentId: 2 },
  { id: 7, name: "Product Owner", description: "Product Owner", parentId: 6 },
  { id: 8, name: "Tech Lead", description: "Technical Team Lead", parentId: 7 },
  { id: 9, name: "Frontend Developer", description: "Frontend Developer", parentId: 8 },
  { id: 10, name: "Backend Developer", description: "Backend Developer", parentId: 8 },
  { id: 11, name: "DevOps Engineer", description: "DevOps Engineer", parentId: 8 },
  { id: 12, name: "QA Engineer", description: "Quality Assurance Engineer", parentId: 7 },
  { id: 13, name: "Scrum Master", description: "Scrum Master", parentId: 7 },
  { id: 14, name: "Chief Accountant", description: "Chief Accountant", parentId: 3 },
  { id: 15, name: "Financial Analyst", description: "Financial Analyst", parentId: 14 },
  { id: 16, name: "Account and Payable", description: "Account and Payable", parentId: 14 },
  { id: 17, name: "Internal Audit", description: "Internal Audit", parentId: 3 },
  { id: 18, name: "Product Manager", description: "Product Manager", parentId: 4 },
  { id: 19, name: "Operation Manager", description: "Operation Manager", parentId: 4 },
  { id: 20, name: "Customer Relation", description: "Customer Relation", parentId: 4 },
]

// In-memory database for the application
let positionsData = [...mockPositions]

interface PositionsState {
  positions: Position[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: PositionsState = {
  positions: [],
  status: "idle",
  error: null,
}

// Async thunks
export const fetchPositions = createAsyncThunk("positions/fetchPositions", async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return positionsData
})

export const addPosition = createAsyncThunk("positions/addPosition", async (position: Omit<Position, "id">) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newPosition = {
    ...position,
    id: Math.max(0, ...positionsData.map((p) => p.id)) + 1,
  }

  positionsData.push(newPosition)
  return newPosition
})

export const updatePosition = createAsyncThunk("positions/updatePosition", async (position: Position) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = positionsData.findIndex((p) => p.id === position.id)
  if (index !== -1) {
    positionsData[index] = position
  }

  return position
})

export const deletePosition = createAsyncThunk("positions/deletePosition", async (id: number) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  positionsData = deletePositionAndChildren(positionsData, id)
  return id
})

// Helper function to recursively delete a position and all its children
const deletePositionAndChildren = (positions: Position[], id: number): Position[] => {
  // Get all direct children
  const childrenIds = positions.filter((p) => p.parentId === id).map((p) => p.id)

  // Recursively delete all children
  let updatedPositions = [...positions]
  for (const childId of childrenIds) {
    updatedPositions = deletePositionAndChildren(updatedPositions, childId)
  }

  // Delete the position itself
  return updatedPositions.filter((p) => p.id !== id)
}

const positionsSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchPositions.fulfilled, (state, action: PayloadAction<Position[]>) => {
        state.status = "succeeded"
        state.positions = action.payload
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch positions"
      })
      .addCase(addPosition.fulfilled, (state, action: PayloadAction<Position>) => {
        state.positions.push(action.payload)
      })
      .addCase(updatePosition.fulfilled, (state, action: PayloadAction<Position>) => {
        const index = state.positions.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.positions[index] = action.payload
        }
      })
      .addCase(deletePosition.fulfilled, (state, action: PayloadAction<number>) => {
        state.positions = deletePositionAndChildren(state.positions, action.payload)
      })
  },
})

export default positionsSlice.reducer

