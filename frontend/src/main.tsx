import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Global, css} from '@emotion/react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const globalStyle = css`
  html, body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #4464AD;
  }

  h1, h2, h3 {
    margin: 0;
  }
`

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global styles={globalStyle}/>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router = {router}/>
    </QueryClientProvider>
  </StrictMode>,
)
