import { Fragment as F, h } from 'preact'

import { setPageMeta } from '~/lib/router'
import { Paths } from '~/routes'

export default function ForgotPassword() {
	setPageMeta({ title: 'Forgot Password' })
	const search = new URLSearchParams(location.search)
	search.set('replace', 'true')
	const searchStr = '?' + search.toString()
	return <F>
		<h1>Forgot Password</h1>
		<ul>
			<li><a href={Paths.Login + searchStr}>Go back to Login</a></li>
		</ul>
	</F>
}