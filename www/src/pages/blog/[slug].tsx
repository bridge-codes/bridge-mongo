import path from 'path';
import dayjs from 'dayjs'
import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import rehypeSlug from 'rehype-slug'
import { MDXRemote } from 'next-mdx-remote'
import rehypeHighlight from 'rehype-highlight'
import rehypeCodeTitles from 'rehype-code-titles'
import { serialize } from 'next-mdx-remote/serialize'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getSlug, getArticleFromSlug, getAllArticles } from '../../utils/mdx'
import theme from "../../tokyo.json"
import ts from 'typescript';
import remarkShikiTwoslash from 'remark-shiki-twoslash';
import Link from 'next/link'
import { Layout } from '@/components/Layouts'
import { useRouter } from 'next/router'
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme2 from 'prism-react-renderer/themes/nightOwl';
import { useEffect, useState } from 'react';
import { createDefaultMapFromNodeModules } from '@typescript/vfs';
import fs from 'fs';

// import { SectionTitle, Text } from '../../data/components/mdx-components'
//
const P = (props: any) => {
  return <p className='text-neutral-800 mb-5' {...props} style={{ lineHeight: '28px' }} />
}

const A = (props: any) => {
  return <a className='text-main hover:underline font-medium' {...props} />
}


const H2 = (props: any) => {
  return <h2 className='font-bold text-2xl text-neutral-800 mb-8' {...props} />
}


const H3 = (props: any) => {
  return <h2 className='font-bold text-xl text-neutral-800 mb-3 mt-8' {...props} />
}

export const List = (props: any): JSX.Element => {
  return (
    <li className="flex gap-2 px-4 mb-4">
      <p
        className="mb-0 ml-1 text-base text-neutral-600"
        {...props}
      />
    </li>
  );
};


export const Code = (props: any): JSX.Element => {
  const language =
    props.className?.replace('language-', '').trim() || props?.language;
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (str: string) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <>
      <div>
        <div
          className="m-5 text-sm"
          style={{ scrollbarColor: 'rgb(0,0,0,0)', fontSize: 13 }}
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default function Blog({ post: { source, frontmatter, all } }) {
  console.log("all", all)
  return (
    <>
      <Layout>
        <Head>
          <title>{frontmatter?.title} | Bridge-Mongo</title>
        </Head>
        <div className="">
          <div className="content">
            <div className='relative mx-auto flex max-w-8xl justify-center'>
              {/* NAVBAR  */}
              <div className="h-max sticky top-20 contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 lg:dark:border-white/10 xl:w-80">
                <div className="hidden lg:relative lg:block lg:flex-none">
                  <p className='text-neutral-900 text-sm font-semibold mb-2'>Guides</p>
                  {all && all.map((el, index) => {
                    console.log("elSlug", el?.slug)
                    if (el?.title && el?.slug) {
                      return <NavLink name={el.title} href={el.slug} />
                    }
                  }
                  )}
                </div>
              </div>

              {/* Content */}
              <div className='min-w-0 max-w-xl flex-auto px-4 py-4 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16'>
                <article className='max-w-3xl mx-auto py-4'>
                  {/* <Bread /> */}
                  <h1 className="text-4xl text-neutral-900 font-bold mb-8">{frontmatter.title}</h1>
                  {/* <p className="publish-date"> */}
                  {/*   {dayjs(frontmatter.publishedAt).format('MMMM D, YYYY')} &mdash;{' '} */}
                  {/*   {frontmatter.readingTime} */}
                  {/* </p> */}
                  <MDXRemote {...source} components={{
                    p: P,
                    h2: H2,
                    h3: H3,
                    ul: List,
                    link: A,
                    a: A
                    // code: Code
                  }} />
                </article>
              </div>

              {/* On this page */}
              {/* <div className='hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-4 xl:pr-6 border-l border-neutral-200 h-max'> */}

              {/* </div> */}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

const Bread = () => {
  const all = useRouter()

  const el = all.asPath.split('/').map((el) => {
    if (el) return el
  }).filter((el) => el && el.length > 0)

  console.log(el)
  return (
    <div className='flex gap-1 items-center text-neutral-600'>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29303 2.293C9.48056 2.10553 9.73487 2.00021 10 2.00021C10.2652 2.00021 10.5195 2.10553 10.707 2.293L17.707 9.293C17.8468 9.43285 17.942 9.61102 17.9806 9.80497C18.0192 9.99892 17.9994 10.2 17.9237 10.3827C17.848 10.5654 17.7199 10.7215 17.5555 10.8314C17.3911 10.9413 17.1978 11 17 11H16V17C16 17.2652 15.8947 17.5196 15.7071 17.7071C15.5196 17.8946 15.2652 18 15 18H13C12.7348 18 12.4805 17.8946 12.2929 17.7071C12.1054 17.5196 12 17.2652 12 17V14C12 13.7348 11.8947 13.4804 11.7071 13.2929C11.5196 13.1054 11.2652 13 11 13H9.00003C8.73481 13 8.48046 13.1054 8.29292 13.2929C8.10539 13.4804 8.00003 13.7348 8.00003 14V17C8.00003 17.2652 7.89467 17.5196 7.70714 17.7071C7.5196 17.8946 7.26525 18 7.00003 18H5.00003C4.73481 18 4.48046 17.8946 4.29292 17.7071C4.10539 17.5196 4.00003 17.2652 4.00003 17V11H3.00003C2.80228 11 2.60898 10.9413 2.44457 10.8314C2.28016 10.7215 2.15202 10.5654 2.07635 10.3827C2.00068 10.2 1.98088 9.99892 2.01945 9.80497C2.05802 9.61102 2.15322 9.43285 2.29303 9.293L9.29303 2.293Z" fill="black" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.20999 14.77C7.07216 14.6267 6.99685 14.4346 7.0006 14.2359C7.00435 14.0371 7.08686 13.848 7.22999 13.71L11.168 10L7.22999 6.29C7.15565 6.22256 7.0956 6.14089 7.0534 6.04982C7.01119 5.95875 6.9877 5.86013 6.98431 5.75982C6.98093 5.6595 6.99771 5.55952 7.03366 5.46581C7.06962 5.3721 7.12402 5.28656 7.19365 5.21426C7.26327 5.14196 7.3467 5.08437 7.43899 5.0449C7.53127 5.00543 7.63055 4.98489 7.73092 4.9845C7.83129 4.9841 7.93072 5.00385 8.02332 5.04259C8.11592 5.08132 8.1998 5.13825 8.26999 5.21L12.77 9.46C12.8426 9.52996 12.9003 9.61384 12.9398 9.70662C12.9792 9.7994 12.9995 9.89918 12.9995 10C12.9995 10.1008 12.9792 10.2006 12.9398 10.2934C12.9003 10.3862 12.8426 10.47 12.77 10.54L8.26999 14.79C8.12674 14.9278 7.93462 15.0031 7.73585 14.9994C7.53709 14.9956 7.34795 14.9131 7.20999 14.77Z" fill="#717179" />
      </svg>
      {el.map((el, index) => <div className='items-center flex gap-1'>
        {el && index < el?.length && index != 0 &&
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.20999 14.77C7.07216 14.6267 6.99685 14.4346 7.0006 14.2359C7.00435 14.0371 7.08686 13.848 7.22999 13.71L11.168 10L7.22999 6.29C7.15565 6.22256 7.0956 6.14089 7.0534 6.04982C7.01119 5.95875 6.9877 5.86013 6.98431 5.75982C6.98093 5.6595 6.99771 5.55952 7.03366 5.46581C7.06962 5.3721 7.12402 5.28656 7.19365 5.21426C7.26327 5.14196 7.3467 5.08437 7.43899 5.0449C7.53127 5.00543 7.63055 4.98489 7.73092 4.9845C7.83129 4.9841 7.93072 5.00385 8.02332 5.04259C8.11592 5.08132 8.1998 5.13825 8.26999 5.21L12.77 9.46C12.8426 9.52996 12.9003 9.61384 12.9398 9.70662C12.9792 9.7994 12.9995 9.89918 12.9995 10C12.9995 10.1008 12.9792 10.2006 12.9398 10.2934C12.9003 10.3862 12.8426 10.47 12.77 10.54L8.26999 14.79C8.12674 14.9278 7.93462 15.0031 7.73585 14.9994C7.53709 14.9956 7.34795 14.9131 7.20999 14.77Z" fill="#717179" />
          </svg>
        }
        <div className='py-2 px-3 text-neutral-600'>
          {el}
        </div>

      </div>
      )}
    </div>
  )
}

type NavLinkType = {
  name: string;
  href: string;
}
const NavLink = (props: NavLinkType) => {
  const router = useRouter()
  const isSelected = router.asPath.toLowerCase().includes(props.href.toLowerCase())

  console.log(isSelected)
  return <div className={`transition-all duration-500 bg-neutral-100 px-7 py-1.5 rounded-md relative ${isSelected ? "bg-opacity-100" : "bg-opacity-0"}`}>
    <div className='absolute left-1.5 h-full bg-neutral-300 z-10 top-0' style={{ width: 1 }} />
    <div>
      <div className='transition-all duration-500 delay-75 absolute left-1.5 h-3/4 top-1/2 -translate-y-1/2 bg-green-600 z-20' style={{ width: isSelected ? 2 : 0 }} />
    </div>
    <Link href={props.href} className={`text-sm hover:text-neutral-800 ${isSelected ? "text-neutral-900" : "text-neutral-500"}`}>{props.name}</Link>
  </div>
}



const addFilesFromFolder = function addAllFilesFromFolder(
  map: Map<string, string>,
  workingDir: string,
  libName: string
) {
  const walk = function walk(dir: any) {
    let results: any = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
      file = path.join(dir, file);
      const stat = fs.statSync(file);

      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        results = results.concat(walk(file));
      } else {
        /* Is a file */
        results.push(file);
      }
    });
    return results;
  };

  const allFiles = walk(workingDir);

  allFiles.forEach(function(lib: any) {
    const fsPath =
      '/node_modules/@types' + '/' + libName + lib.replace(workingDir, '');
    const content = fs.readFileSync(lib, 'utf8');
    const validExtensions = ['.ts', '.tsx', '.d.ts'];

    if (validExtensions.includes(path.extname(fsPath))) {
      map.set(fsPath, content);
    }
  });
};

export async function getStaticProps({ params }) {
  //fetch the particular file based on the slug
  const { slug } = params
  const { content, frontmatter } = await getArticleFromSlug(slug)
  const all = await getAllArticles()

  const fsMap = createDefaultMapFromNodeModules({
    target: ts.ScriptTarget.ES2020,
  });

  addFilesFromFolder(fsMap, 'node_modules/bridge-mongo', 'bridge-mongo');

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        // require('remark-code-titles'),
        [
          remarkShikiTwoslash, { theme: theme, wrapFragments: true },
        ],
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: { className: ['anchor'] },
          },
          { behaviour: 'wrap' },
        ],
        rehypeHighlight,
        // rehypeCodeTitles,
      ],
    },
    scope: frontmatter
  })

  return {
    props: {
      post: {
        source: mdxSource,
        frontmatter,
        all
      },
    },
  }
}

// dynamically generate the slugs for each article(s)
export async function getStaticPaths() {
  // getting all paths of each article as an array of
  // objects with their unique slugs
  const paths = (await getSlug()).map((slug) => ({ params: { slug } }))

  return {
    paths,
    // in situations where you try to access a path
    // that does not exist. it'll return a 404 page
    fallback: false,
  }
}
