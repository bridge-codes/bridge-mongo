import React, { ButtonHTMLAttributes } from 'react';
import Layout from '@theme/Layout';
import { BoltIcon, CommandLineIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline"

export default function Home() {
  return (
    <div className='bg-white'>
      <Layout>
        {/* <Redirect to="/docs/quickstart" /> */}
        <Section1 />
        <Section2 />
        <GetDeeper />
      </Layout>
    </div>
  )
}

const Section1 = () => {
  return (
    <div className='md:px-6 md:rounded-md py-6'>
      <div className='bg-neutral-100  md:rounded-md px-6'>
        <div className='max-w-7xl grid md:grid-cols-2 mx-auto md:pt-24 md:pb-48 pt-12 pb-12 gap-16'>
          <div className=''>
            <h1 className='font-bold md:text-5xl text-4xl text-neutral-900'>The fully typed Typescript mongoDB ODM</h1>
            <p className='text-neutral-600 mt-6'>
              No more guesswork, no more struggling: Bridge-mongo simplifies your MongoDB queries and aggregate pipelines
            </p>
            <div className='flex gap-4 mt-9'>
              <Button name="Get started" onClick={() => {
                window.location.href = "/docs/quickstart"
              }} />
              {/* <ButtonSec name="Clone the example" /> */}
            </div>
          </div>
          <div className='relative'>
            <video className='md:absolute rounded-md -top-12' src='/bridge-mongo-demo.mp4' autoPlay={true} controls={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Section2 = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 xl:pt-48 md:pt-32 sm:pt-24 pt-0 pb-12'>
      {/* <p className='uppercase text-center font-medium text-xs text-neutral-600'>Can be easily used with:</p> */}
      {/* <img src="/frameworks.svg" className="mx-auto mt-4" /> */}
      <div className='grid md:grid-cols-2 gap-8 mt-12'>
        <div className='border border-neutral-200 md:p-12 sm:p-8 p-6 rounded-md'>
          <BoltIcon className='h-7 w-7 text-neutral-900 mb-2' />
          <h3 className='font-medium text-xl text-neutral-800 mb-4'>Similar syntax of mongoose</h3>
          <p className='text-neutral-600 mt-1'>Bridge-mongo's syntax is designed to be very similar to Mongoose, making it easy for developers to transition to using it. This means you can continue to use the same familiar syntax, while taking advantage of all the benefits of Bridge-mongo's fully typed ORM. With Bridge-mongo, you can enjoy the convenience and flexibility of Mongoose, while ensuring type safety and avoiding the pitfalls of dynamic typing.</p>
        </div>
        <div className='flex flex-col gap-8'>
          <div className='border border-neutral-200 md:p-12 sm:p-8 p-6 rounded-md'>
            <Square3Stack3DIcon className='h-7 w-7 text-neutral-900 mb-2' />
            <h3 className='font-medium text-xl text-neutral-800 mb-4'>Complex aggregation</h3>
            <p className='text-neutral-600 mt-1'>With Bridge-mongo, you can easily perform complex aggregation pipelines, making it easy to query, transform, and analyze data from your MongoDB collections. This makes it an ideal choice for building data-intensive applications.</p>
          </div>
          <div className='border border-neutral-200 md:p-12 sm:p-8 p-6 rounded-md'>
            <CommandLineIcon className='h-7 w-7 text-neutral-900 mb-2' />
            <h3 className='font-medium text-xl text-neutral-800 mb-4'>Fully typed</h3>
            <p className='text-neutral-600 mt-1'>Bridge-mongo is written in Typescript, making it fully typed and providing better type-safety and code completion in your IDE. This ensures fewer runtime errors and makes development much more efficient.</p>
          </div>
        </div>
      </div>
      <div className='rounded-md overflow-hidden mt-8 w-full aspect-video sm:block hidden'>
        <iframe src="https://stackblitz.com/edit/bridge-mongo?ctl=1&embed=1&file=index.ts&hideNavigation=1&view=editor" className='w-full aspect-video h-full' />
      </div>
    </div>
  )
}

const GetDeeper = () => {
  return (
    <div className='border-t border-neutral-200'>
      <div className='max-w-7xl px-4 mx-auto py-16'>
        <div className='grid md:grid-cols-12 items-center gap-6'>
          <div className='col-span-3'>
            <h3 className='text-neutral-900 font-bold text-5xl'>Want to get deeper?</h3>
          </div>
          <div className='col-span-9'>
            <p className='text-neutral-600 text-lg'>Try out Bridge, a Nodejs Typescript framework and see how you could have a fully type-safe API</p>
            <div className='flex gap-3 mt-3'>
              <Button name="Discover Bridge" onClick={() => {
                window.location.href = "https://bridge.codes"
              }} />
              {/* <ButtonSec name="Bridge + bridge-mongo example" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

const Button = (props: MainButtonProps) => {
  return (
    <button className='text-sm text-white font-medium rounded-sm bg-main px-8 py-2.5' {...props}>
      {props.name}
    </button>
  )
}

const ButtonSec = (props: MainButtonProps) => {
  return (
    <button className='text-sm text-neutral-800 font-medium rounded-sm px-8 py-2.5 border border-neutral-600'>
      {props.name}
    </button>
  )
}
