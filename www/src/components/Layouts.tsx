import Link from "next/link"

export const Layout = (props: any) => {
  return (
    <>
      <header className="flex px-6 items-center justify-between py-1.5 sticky top-0 bg-white z-40 border-b border-neutral-200">
        <nav className="flex gap-4 items-center">
          <Link href="/">
            <img src="/logo.svg" className="h-8" />
          </Link>
          <NavLink name="Home" href={"/"} />
          <NavLink name="Get started" href={"/blog/introduction"} />
        </nav>
        <div className="flex gap-4 items-center">
          <GitHubIcon />
          <GetStartedButton />
        </div>
      </header>
      <div>{props.children}</div>
      <Footer />
    </>
  )
}

const GetStartedButton = () => {
  return (
    <Link href="/blog/introduction">
      <button className="px-6 rounded-sm hover:bg-neutral-100 py-2.5 text-sm border border-neutral-300 text-neutral-800 font-medium">
        Get started
      </button>
    </Link>
  )
}

const GitHubIcon = () => {
  return (
    <a href={'https://github.com/bridgecodes/bridge'}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_10_62)">
          <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="black" />
        </g>
        <defs>
          <clipPath id="clip0_10_62">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </a>
  )
}

const GitHubIconWhite = () => {
  return (
    <a href={'https://github.com/bridgecodes/bridge'}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-300">
        <g clip-path="url(#clip0_10_62)">
          <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="current" />
        </g>
        <defs>
          <clipPath id="clip0_10_62">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </a>
  )
}


type NavLinkType = {
  href: string;
  name: string;
}

const NavLink = (props: NavLinkType) => {
  return (<Link href={props.href} className="text-sm font-semibold hover:text-green-400">{props.name}</Link>)
}

const Footer = () => {
  return (
    <div className="bg-black py-12">
      <div className="max-w-7xl px-4 mx-auto">
        <div className="flex justify-between border-b border-neutral-900 pb-16">
          <div>
            <img src="" className="h-9" />
            <p className="text-neutral-300">Bridge</p>
          </div>
          <div>
            <GitHubIconWhite />
          </div>
        </div>
        <div className="grid grid-cols-4 pt-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase text-neutral-500">resources</p>
            <ul>
              <li className="text-sm text-neutral-300">Blog</li>
              <li className="text-sm text-neutral-300">Blog</li>
            </ul>
          </div>


          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase text-neutral-500">resources</p>
            <ul>
              <li className="text-sm text-neutral-300">Blog</li>
              <li className="text-sm text-neutral-300">Blog</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase text-neutral-500">resources</p>
            <ul>
              <li className="text-sm text-neutral-300">Blog</li>
              <li className="text-sm text-neutral-300">Blog</li>
            </ul>
          </div>


          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase text-neutral-500">resources</p>
            <ul>
              <li className="text-sm text-neutral-300">Blog</li>
              <li className="text-sm text-neutral-300">Blog</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

