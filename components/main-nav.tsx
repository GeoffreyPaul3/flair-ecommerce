import Link from "next/link"


import Image from "next/image"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
          <Image src="/tconnect.png" alt="" width={120} height={100}/>
      </Link>
    </div>
  )
}
