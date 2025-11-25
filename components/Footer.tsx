import packageJson from "@/package.json";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - Branding */}
          <div className="text-sm text-gray-600">
            Made with 🧡 by{" "}
            <a
              href="https://www.webformat.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              Webformat
            </a>
          </div>

          {/* Right side - Version */}
          <div className="text-sm text-gray-500">
            v{packageJson.version}
          </div>
        </div>
      </div>
    </footer>
  );
}

