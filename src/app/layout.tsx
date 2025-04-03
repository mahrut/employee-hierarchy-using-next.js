"use client"

import type React from "react"

import "@mantine/core/styles.css"
import "./globals.css"
import { MantineProvider, ColorSchemeScript } from "@mantine/core"
import { Provider } from "react-redux"
import { store } from "../../lib/store"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Employee Hierarchy Manager</title>
      </head>
      <body>
        <Provider store={store}>
          <MantineProvider>
            <main className="min-h-screen bg-gray-50">{children}</main>
          </MantineProvider>
        </Provider>
      </body>
    </html>
  )
}

