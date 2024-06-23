import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AvatarGenerator = () => {
  return `https://api.dicebear.com/8.x/thumbs/svg?seed=${Math.random().toString()}`;
}

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={AvatarGenerator()} alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Distero Dilemma</p>
          <p className="text-sm text-muted-foreground">
            With McKinsey Associate John
          </p>
        </div>
        <div className="ml-auto font-medium">2/5</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src={AvatarGenerator()} alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">PharmaCo</p>
          <p className="text-sm text-muted-foreground">With Bain Analyst John Lee</p>
        </div>
        <div className="ml-auto font-medium">5/7</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={AvatarGenerator()} alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Distero Dilemma</p>
          <p className="text-sm text-muted-foreground">
            isabella.nguyen@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">3/8</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={AvatarGenerator()} alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">PharmaCo</p>
          <p className="text-sm text-muted-foreground">will@email.com</p>
        </div>
        <div className="ml-auto font-medium">4/8</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={AvatarGenerator()} alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Distero Dilemma</p>
          <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
        </div>
        <div className="ml-auto font-medium">3/5</div>
      </div>
    </div>
  );
}
