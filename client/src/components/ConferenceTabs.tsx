import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ConferenceTabsProps {
  eastContent: React.ReactNode;
  westContent: React.ReactNode;
  defaultValue?: "east" | "west" | "all";
  allContent?: React.ReactNode;
}

export function ConferenceTabs({ 
  eastContent, 
  westContent, 
  allContent,
  defaultValue = "east" 
}: ConferenceTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
        <TabsTrigger value="east" data-testid="tab-east">Eastern</TabsTrigger>
        <TabsTrigger value="west" data-testid="tab-west">Western</TabsTrigger>
        <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
      </TabsList>
      
      <TabsContent value="east" className="mt-0">
        {eastContent}
      </TabsContent>
      
      <TabsContent value="west" className="mt-0">
        {westContent}
      </TabsContent>
      
      <TabsContent value="all" className="mt-0">
        {allContent || (
          <div className="grid gap-6 lg:grid-cols-2">
            {eastContent}
            {westContent}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
