# UI Color Token & Typography Refactor — Dark/Light Contrast Fix

- [x] 1. Enable `darkMode: 'class'` in `tailwind.config.js`
- [x] 2. Add `dark` class to root wrapper in `src/App.tsx`
- [x] 3. Update `src/components/ui.tsx` (Card, Badge tones, EmptyState, LoadingState)
- [x] 4. Update `src/views/TimetableView.tsx` (period time box, badge, card details, day tabs)
- [x] 5. Remove conflicting `.theme-dark .bg-slate-50` override in `src/index.css`
- [x] 6. Update `src/views/OverviewView.tsx` — light/dark theme-aware styling (StatCard, NextClassCard, Pinned Notices, Due Soon, headings/text/icons)
- [x] 7. Verify build passes

## Follow-up (Light Mode fixes for Overview/Dashboard)
- Stat cards & main cards: `bg-white dark:bg-slate-900`, borders `dark:border-slate-800`
- Card titles/numbers: `text-slate-900 dark:text-white`
- Descriptions/notices: `text-slate-600 dark:text-slate-400`
- Notice/Due Soon containers: `bg-slate-50 dark:bg-slate-900/60`, dividers `dark:divide-slate-800`
- NextClassCard time box: `dark:bg-slate-800`, text `dark:text-white`/`dark:text-slate-400`
- Tone icon chips: dark variants added
</content>
