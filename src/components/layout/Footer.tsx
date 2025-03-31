export default function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Pouria Rouzrokh. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Social links will be added here */}
          </div>
        </div>
      </div>
    </footer>
  );
} 