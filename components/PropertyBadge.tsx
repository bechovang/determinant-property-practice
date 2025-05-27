import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Property {
  id: number
  name: string
  description: string
  type: string
}

interface PropertyBadgeProps {
  property: Property
}

export function PropertyBadge({ property }: PropertyBadgeProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "swap":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "scale":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "add":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "identical":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "triangular":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className={`cursor-help transition-colors ${getTypeColor(property.type)}`}>
            Tính chất {property.id}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{property.name}</p>
            <p className="text-sm">{property.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
