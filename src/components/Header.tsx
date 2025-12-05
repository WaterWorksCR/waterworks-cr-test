import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-secondary shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Water Works C&R
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-foreground hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-foreground hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="text-foreground hover:text-primary"
              >
                Place Order
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                className="text-foreground hover:text-primary"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}