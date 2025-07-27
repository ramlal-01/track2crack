# Core Components Refactoring

This directory contains the refactored components for the Core Subject Pages, breaking down the original 935-line `CoreSubjectPage.jsx` into smaller, maintainable, and mobile-responsive components.

## 🏗️ Architecture Overview

The original monolithic `CoreSubjectPage.jsx` has been split into 6 focused components:

### 1. **ProgressCards.jsx**
- **Purpose**: Displays the four progress statistics cards
- **Features**: 
  - Total Topics, Completed, Bookmarked, Progress percentage
  - Circular progress bar with dark mode support
  - Mobile-responsive grid layout (1 col on mobile, 2 on md, 4 on lg)
  - Hover animations and color-coded borders

### 2. **CurrentTopicSection.jsx**
- **Purpose**: Handles the current active topic with learning flow
- **Features**:
  - Yes/No knowledge assessment
  - Learning resources display
  - Quiz initiation
  - Bookmark and reminder functionality
  - Mobile-responsive layout (stacked on mobile, side-by-side on desktop)
  - Score display card

### 3. **FilterControls.jsx**
- **Purpose**: Manages filtering and search functionality
- **Features**:
  - Filter tabs (All, Important, Other, Bookmarked, Remind)
  - "Completed Only" checkbox
  - Search input with icon
  - Mobile-responsive layout with abbreviated labels on small screens
  - Dark mode support

### 4. **TopicsTable.jsx**
- **Purpose**: Container for the topics list
- **Features**:
  - Desktop table header (hidden on mobile)
  - Maps through filtered topics to render TopicRow components
  - Empty state handling
  - Responsive design

### 5. **TopicRow.jsx**
- **Purpose**: Individual topic row rendering
- **Features**:
  - **Dual Layout System**:
    - Desktop: Traditional table row layout
    - Mobile: Card-based layout with organized sections
  - Interactive elements: GFG/YouTube links, Quiz button, Bookmark, Reminder, Notes
  - Status indicators and progress tracking
  - Conditional styling based on completion/current topic status
  - Modal for note editing

### 6. **CoreSubjectPage.jsx** (Refactored Main Component)
- **Purpose**: Main orchestrator component
- **Features**:
  - State management for all functionality
  - API calls and data fetching
  - Props distribution to child components
  - Mobile-responsive padding and layout
  - Maintains all original functionality

## 📱 Mobile Responsiveness Features

### Responsive Breakpoints
- **Mobile**: `< 640px` - Single column layouts, stacked elements
- **Tablet**: `640px - 1024px` - Two column grids, condensed layouts  
- **Desktop**: `> 1024px` - Full table layouts, side-by-side sections

### Mobile-Specific Enhancements
1. **Filter Controls**: Abbreviated button labels on mobile (`Important` → `Imp`)
2. **Topic Rows**: Complete layout transformation from table to cards
3. **Progress Cards**: Responsive grid with proper spacing
4. **Current Topic**: Stacked layout instead of side-by-side
5. **Touch-Friendly**: Larger tap targets and proper spacing

## 🎨 Dark Mode Support

All components support dark mode through:
- Consistent dark mode classes (`dark:bg-gray-800`, etc.)
- Theme-aware color schemes
- Context-based theme detection
- Proper contrast ratios

## 🔧 Props Interface

### Main Component Props
```javascript
CoreSubjectPage({ subject, title })
```

### Child Component Props
Each component receives focused props relevant to its functionality, promoting separation of concerns and reusability.

## 🚀 Benefits of Refactoring

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused across different subjects
3. **Mobile-First**: Responsive design from the ground up
4. **Performance**: Smaller component trees and focused re-renders
5. **Testing**: Easier to test individual components
6. **Development**: Easier to locate and modify specific functionality

## 📂 File Structure
```
client/src/components/Core/
├── ProgressCards.jsx          # Progress statistics cards
├── CurrentTopicSection.jsx    # Active topic learning flow
├── FilterControls.jsx         # Filtering and search
├── TopicsTable.jsx           # Topics container
├── TopicRow.jsx              # Individual topic row
└── README.md                 # This documentation
```

## 🔄 Migration Guide

The refactored components maintain 100% feature parity with the original implementation:
- All state management preserved
- All API calls maintained
- All user interactions functional
- All styling and animations retained
- Enhanced mobile experience added

## 🛠️ Usage

The three subject-specific files (`coreCN.jsx`, `coreDBMS.jsx`, `coreOS.jsx`) remain unchanged and continue to work seamlessly with the refactored `CoreSubjectPage.jsx`.

```javascript
// Example usage (unchanged)
import CoreSubjectPage from "./CoreSubjectPage";

const CoreCN = () => {
  return (
    <CoreSubjectPage 
      subject="CN" 
      title="Computer Networks" 
    />
  );
};
```

This refactoring provides a solid foundation for future enhancements while maintaining all existing functionality and significantly improving the mobile user experience.