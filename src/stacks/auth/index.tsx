import { lazy, Suspense } from 'react'
import useStackHandler from '../../hooks/useStackHandler'

const IndexRoute = lazy(() => import('./routes/IndexRoute'))
const UserRoute = lazy(() => import('./routes/UserRoute'))

const basePath = '/auth'
export default function AuthStack() {
    const {pathname} = useStackHandler(basePath)

    return (
        <Suspense fallback={<></>}>{
            !pathname.startsWith(basePath) && <></>
            || pathname === basePath && <IndexRoute />
            || <UserRoute />
        }</Suspense>
    )       
}
AuthStack.basePack = basePath