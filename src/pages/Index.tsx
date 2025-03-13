
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Vanna Universe</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Project</CardTitle>
              <CardDescription>
                Your project has been successfully imported
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This is a preview of your application. You can now start customizing and building on top of this foundation.
              </p>
            </CardContent>
            <CardFooter>
              <Button>Get Started</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Features</CardTitle>
              <CardDescription>
                Key components ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside text-gray-600">
                <li>React with TypeScript</li>
                <li>Tailwind CSS for styling</li>
                <li>Shadcn UI components</li>
                <li>React Router for navigation</li>
                <li>React Query for data fetching</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Explore Docs</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
