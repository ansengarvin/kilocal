import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Global, css} from '@emotion/react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mobileView } from './lib/defines.tsx'

const globalStyle = css`
  html, body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #ffffff;

    color: #353535;
  }

  h1, h2, h3 {
    margin: 0;

    color: #3d3d3d;
  }

  h1 {
    font-size: 2em;

    @media (max-width: ${mobileView}) {
      font-size: 1.5em;
    }
  }

  h2 {
    font-size: 1.5em;

    @media (max-width: ${mobileView}) {
      font-size: 1.25em;
    }
  }

  h3 {
    font-size: 1.25em;

    @media (max-width: ${mobileView}) {
      font-size: 1em;
    }
  }

  label, th {
    font-weight: normal;
    font-size: 1em;

    @media (max-width: ${mobileView}) {
      font-size: 0.75em;
    }
  }

  span {
    font-size: 1em;

    @media (max-width: ${mobileView}) {
      font-size: 0.75em;
    }
  }

  .appElement {
    background-color: #e9e9e9;
  }

  a {
    // Default blue link color
    color: #0073ff;
    text-decoration: none;
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
