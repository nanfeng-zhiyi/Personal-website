import { ReactNode } from 'react'

interface TechCardProps {
  icon?: ReactNode
  title: string
  description: string
  className?: string
}

export default function TechCard({ icon, title, description, className = '' }: TechCardProps) {
  return (
    <div className={`glass-card rounded-xl p-6 ${className}`}>
      {icon && (
        <div className="text-4xl mb-4 transform transition-transform hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold mb-3 text-cyan-400">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}

