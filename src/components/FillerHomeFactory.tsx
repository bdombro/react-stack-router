import { h } from 'preact';
import setPageMeta from '~/lib/routing/setPageMeta';

export default function FillerHomeFactory(name: string) {
    return () => {
        setPageMeta({ title: name })
        const listPath = location.pathname.split('/').slice(0, -1).join('/') + '/list'
        const entryPath = location.pathname.split('/').slice(0, -1).join('/') + '/entry'
        return <div style={{ padding: "0 10px" }}>
            <h1>Hello, {name}!</h1>
            <ul>
                <li><a href={listPath} >List Route</a></li>
                <li><a href={entryPath + '?id=' + Math.random()} >Random Entry</a></li>
            </ul>
            <br /><br /><br /><br /><br />1<br /><br /><br /><br /><br />2
            <br /><br /><br /><br /><br />3<br /><br /><br /><br /><br />4
            <br /><br /><br /><br /><br />5<br /><br /><br /><br /><br />6
            <br /><br /><br /><br /><br />7<br /><br /><br /><br /><br />8
            <div>Bottom</div>
        </div>
    }
}