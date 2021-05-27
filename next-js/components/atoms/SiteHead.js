import Head from 'next/Head'

export default function SiteHead({children}){
    return(
        <Head>
            <link
                href="https://fonts.googleapis.com/css?family=Montserrat:400,700"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css?family=Lato:500,700"
                rel="stylesheet"
            />
            {children}
        </Head>
    )
}