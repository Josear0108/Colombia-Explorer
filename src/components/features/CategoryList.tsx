import { useState } from 'react'
import { Waves, Anchor, TreePine, Landmark, LayoutGrid, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CategoryItem {
  id: string
  Icon: LucideIcon
  inactiveBg: string
  iconColor: string
}

interface CategoryListProps {
  onSelect?: (id: string) => void
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all',     Icon: LayoutGrid, inactiveBg: 'bg-gray-100',  iconColor: 'text-gray-500'  },
  { id: 'beach',   Icon: Waves,      inactiveBg: 'bg-sky-100',   iconColor: 'text-sky-500'   },
  { id: 'coast',   Icon: Anchor,     inactiveBg: 'bg-blue-100',  iconColor: 'text-blue-500'  },
  { id: 'jungle',  Icon: TreePine,   inactiveBg: 'bg-green-100', iconColor: 'text-green-600' },
  { id: 'history', Icon: Landmark,   inactiveBg: 'bg-amber-100', iconColor: 'text-amber-600' },
]

export default function CategoryList({ onSelect }: CategoryListProps) {
  const [active, setActive] = useState('all')
  const { t } = useTranslation()

  const handleSelect = (id: string) => {
    setActive(id)
    onSelect?.(id)
  }

  return (
    <div className="mt-6 md:mt-10">
      <div className="flex items-center justify-between mb-3 px-4 sm:px-6 lg:px-8">
        <h2 className="text-base font-bold text-gray-900 md:text-lg">{t('categories.title')}</h2>
        <span className="text-xs text-gray-400">{t('categories.types', { count: CATEGORIES.length - 1 })}</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide px-4 sm:px-6 lg:px-8
        md:overflow-visible md:flex-wrap md:gap-4"
      >
        {CATEGORIES.map(({ id, Icon, inactiveBg, iconColor }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`
                flex flex-col items-center gap-2
                min-w-[72px] md:min-w-[88px]
                px-2 py-3 md:px-4 md:py-4
                rounded-2xl border transition-all duration-200
                ${isActive
                  ? 'bg-primary border-primary shadow-md scale-105 text-white'
                  : 'bg-white border-gray-100 hover:border-primary/30 text-gray-600'}
              `}
            >
              <div className={`
                w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center
                ${isActive ? 'bg-white/20' : inactiveBg}
              `}>
                <Icon size={20} className={isActive ? 'text-white' : iconColor} />
              </div>
              <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {t(`categories.${id}`)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
