import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>Checkout my other projects on Github.{" "}
      <a
            href="https://github.com/tarunaksha"
            target="__blank"
            rel="noopener noreferrer"
            className='text-teal-500 hover:underline text-md font-semibold'
          >
            Click here
          </a>
          </p>
      <CallToAction />
    </div>
  )
}