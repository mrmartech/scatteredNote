import NavbarMobile from '@/components/NavbarMobile'
import ProfileBar from '@/components/ProfileBar'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"


export default function Nav({ }) {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <section className=' w-full'>
      <div className='mx-auto max-w-full sm:max-w-screen-md lg:max-w-[90%] flex items-center py-4 font-manrope  pr-0'>
        <NavbarMobile />
        <div className=' bg-custom1 text-center px-8 py-4 text-white font-manrope font-medium'><Link href="/">Logo</Link></div>

        <div className='hidden relative  shrink w-[60%] grow lg:block lg:flex justify-center gap-x-8 font-medium text-[1.125rem] leading-[1.537rem] text-custom1 '>
          <Link href={"#"}>Home</Link>
          <Link href="#">About</Link>
          <Link href="#features">Features</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Subscribe</Link>
        </div>
        {session && <ProfileBar user={session.user} />}
        {!session && (
          <div className=' bg-custom1 text-center px-8 py-4 text-white font-manrope font-medium rounded-xl ml-auto'>
            {!session && (
              <a
                href={`/api/auth/signin`}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Login
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}