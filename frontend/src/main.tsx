import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Global, css} from '@emotion/react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'

const globalStyle = css`
  html, body {
    margin: 0;
  }
`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global styles={globalStyle}/>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
