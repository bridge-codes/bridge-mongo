import React from 'react'
import Head from 'next/head'
import Link from "next/link"
import { getAllArticles } from '../../utils/mdx'

export default function BlogPage({ posts }: any) {
  return (
    <>
      <Head>
        <title>test</title>
      </Head>
      <div>
        {posts.map((frontMatter, index) => {
          return (<Link href={`/blog/${frontMatter?.slug}`} passHref>
            <div>
              <h1>{frontMatter?.title}</h1>
            </div>
          </Link>)
        })}
      </div>
    </>
  )
}


export async function getStaticProps() {
  const articles = await getAllArticles()

  articles
    .map((article) => article.data)
    .sort((a, b) => {
      if (a.data.publishedAt > b.data.publishedAt) return 1
      if (a.data.publishedAt < b.data.publishedAt) return -1

      return 0
    })

  return {
    props: {
      posts: articles.reverse(),
    },
  }
}
