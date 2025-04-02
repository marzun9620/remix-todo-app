import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  buttonText?: string
  onButtonClick?: () => void
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  buttonText = "Learn More",
  onButtonClick,
}: FeatureCardProps) {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Discover more about this amazing feature and how it can help you achieve your goals.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
} 