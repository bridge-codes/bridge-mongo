import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Layout } from '@/components/Layouts'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Layout>
        <Section1 />
        <Section2 />
        <GetDeeper />

      </Layout>
    </>
  )
}

const Section1 = () => {
  return (
    <div className='md:px-6 md:rounded-md '>
      <div className='bg-neutral-100 md:rounded-md px-6'>

        <div className='max-w-7xl grid grid-cols-2 mx-auto py-24 gap-16'>
          <div className=''>
            <h1 className='font-bold text-5xl text-neutral-900'>A mongoose wrapper that enables type-safety and auto-completion</h1>
            <p className='text-neutral-600 mt-6'>
              Make strong links between your models by using a type-safe alternative to mongoose.
            </p>
            <div className='flex gap-4 mt-9'>
              <Button name="Get started" />
              <ButtonSec name="Clone the example" />
            </div>
          </div>
          <div className='relative'>
            <img src="code-demo.svg" className='absolute' />
          </div>

        </div>
      </div>
    </div>
  )
}

const Section2 = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 xl:pt-48 md:pt-32 sm:pt-24 pt-12 pb-24'>
      <p className='uppercase text-center font-medium text-xs text-neutral-600'>Can be easily used with:</p>
      <img src="/frameworks.svg" className="mx-auto mt-4" />
      <div className='grid grid-cols-2 gap-8 mt-12'>
        <div className='border border-neutral-200 md:p-12 sm:p-8 p-6 rounded-md'>
          <h3 className='font-medium text-xl'>Easy to use</h3>
          <p className='text-neutral-600 mt-1'>Easy to integrate into your framework of choice, it saves repetitive CRUD boilerplate and increases type safety. It’s perfect for building production-grade, robust and scalable web applications.</p>
        </div>
        <div className='flex flex-col gap-8'>
          <div className='border border-neutral-200 md:p-12 sm:p-8 p-6 rounded-md'>
            <h3 className='font-medium text-xl'>Easy to use</h3>
            <p className='text-neutral-600 mt-1'>Easy to integrate into your framework of choice, it saves repetitive CRUD boilerplate and increases type safety. It’s perfect for building production-grade, robust and scalable web applications.</p>
          </div>
          <div className='border border-neutral-200 md:p-12 sm:p-8 p-6 rounded-md'>
            <h3 className='font-medium text-xl'>Easy to use</h3>
            <p className='text-neutral-600 mt-1'>Easy to integrate into your framework of choice, it saves repetitive CRUD boilerplate and increases type safety. It’s perfect for building production-grade, robust and scalable web applications.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const GetDeeper = () => {
  return (
    <div className='border-t border-neutral-200'>
      <div className='max-w-7xl px-4 mx-auto py-16'>
        <div className='grid grid-cols-12 items-center'>
          <div className='col-span-3'>
            <h3 className='font-bold text-5xl'>Want to get deeper?</h3>
          </div>
          <div className='col-span-9'>
            <p className='text-neutral-600 text-lg'>Try out Bridge (Nodejs Typescript framework) and see how you could have a fully type-safe API</p>
            <div className='flex gap-3 mt-3'>
              <Button name="Discover bridge" />
              <ButtonSec name="Bridge + bridge-mongo example" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MainButtonProps {
  name: string;
}

const Button = (props: MainButtonProps) => {
  return (
    <button className='text-sm text-white font-medium rounded-sm bg-main px-8 py-2.5 rounded-md'>
      {props.name}
    </button>
  )
}


const ButtonSec = (props: MainButtonProps) => {
  return (
    <button className='text-sm text-neutral-800 font-medium rounded-sm px-8 py-2.5 rounded-md border border-neutral-300'>
      {props.name}
    </button>
  )
}
