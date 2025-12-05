import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-secondary text-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Water Works C&R</h3>
            <p>Your trusted partner for all things water.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Our Address</h3>
            <p>2425 Stafford Blvd, Pecos, TX 79772</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-foreground hover:text-primary">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-foreground hover:text-primary">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-foreground hover:text-primary">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} Water Works C&R. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}