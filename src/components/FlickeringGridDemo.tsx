
import React from "react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function FlickeringGridDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Flickering Grid Component</h2>
        <p className="text-muted-foreground">A visual effect for background elements</p>
      </div>
      
      <Tabs defaultValue="demo">
        <TabsList className="mb-4">
          <TabsTrigger value="demo">Demo</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="demo" className="space-y-6">
          <div className="relative h-[400px] rounded-lg w-full bg-background overflow-hidden border">
            <FlickeringGrid
              className="z-0 absolute inset-0 size-full"
              squareSize={4}
              gridGap={6}
              color="#6B7280"
              maxOpacity={0.5}
              flickerChance={0.1}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md text-center">
                <h3 className="text-xl font-bold mb-2">FlickeringGrid Background</h3>
                <p className="text-muted-foreground">A subtle animated background effect using canvas</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="relative h-[200px] overflow-hidden">
              <FlickeringGrid
                className="z-0 absolute inset-0 size-full"
                squareSize={3}
                gridGap={4}
                color="#1E40AF"
                maxOpacity={0.3}
                flickerChance={0.2}
              />
              <div className="relative p-6 h-full flex items-center justify-center">
                <p className="font-medium text-center">Blue Variant</p>
              </div>
            </Card>
            
            <Card className="relative h-[200px] overflow-hidden">
              <FlickeringGrid
                className="z-0 absolute inset-0 size-full"
                squareSize={6}
                gridGap={8}
                color="#A21CAF"
                maxOpacity={0.2}
                flickerChance={0.05}
              />
              <div className="relative p-6 h-full flex items-center justify-center">
                <p className="font-medium text-center">Purple Variant</p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Component API</h3>
            <div className="space-y-2">
              <p className="text-sm"><strong>squareSize</strong>: Size of each square (default: 4px)</p>
              <p className="text-sm"><strong>gridGap</strong>: Gap between squares (default: 6px)</p>
              <p className="text-sm"><strong>flickerChance</strong>: Probability of flicker per frame (default: 0.3)</p>
              <p className="text-sm"><strong>color</strong>: Color of squares (default: black)</p>
              <p className="text-sm"><strong>maxOpacity</strong>: Maximum opacity of squares (default: 0.3)</p>
              <p className="text-sm"><strong>width/height</strong>: Optional fixed dimensions</p>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Example Code</h3>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
              {`<div className="relative h-[400px]">
  <FlickeringGrid
    className="absolute inset-0" 
    color="#6B7280"
    maxOpacity={0.5}
    flickerChance={0.1}
  />
  <div className="relative z-10">
    Your content here
  </div>
</div>`}
            </pre>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FlickeringGridDemo;
