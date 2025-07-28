# Core Components Refactoring

This directory contains the refactored components for the Core Subject Pages, breaking down the original 935-line `CoreSubjectPage.jsx` into smaller, maintainable, and mobile-responsive components.

## 🏗️ Architecture Overview

The original monolithic `CoreSubjectPage.jsx` has been split into 6 focused components:

### 1. **ProgressCards.jsx**
- **Purpose**: Displays the four progress statistics cards
- **Features**: 
  - Total Topics, Completed, Bookmarked, Quiz-based Progress percentage
  - Circular progress bar with dark mode support
  - **Dual Layout System**: 
    - Mobile: 2x2 grid with compact horizontal design (28px icons)
    - Desktop: 1x4 grid with original vertical design (50px progress ring, larger icons)
  - Shows total quiz attempts instead of current count ("n attempts")
  - Maintains original desktop styling while optimizing mobile experience
  - Responsive sizing and spacing for different screen sizes
  - Hover animations and color-coded borders
  - **Progress Logic**: Uses quiz-based `progressPercent` from API (highest scores per topic)

### 2. **CurrentTopicSection.jsx**
- **Purpose**: Handles the current active topic with learning flow
- **Features**:
  - Yes/No knowledge assessment
  - Learning resources display
  - Quiz initiation
  - Mobile-responsive layout (stacked on mobile, side-by-side on desktop)
  - Score display card
  - **Compact design**: Reduced padding and spacing for minimal height usage
  - **Streamlined interface**: No bookmark or reminder functionality

### 3. **FilterControls.jsx**
- **Purpose**: Manages filtering and search functionality
- **Features**:
  - Filter tabs (All, Important, Other, Bookmarked, Remind)
  - Search input with icon
  - **Dual Layout System**:
    - Mobile: Grid layout (3 cols on mobile, 5 on tablet) with abbreviated labels
    - Desktop: Original horizontal flex layout with full labels
  - No "Completed Only" filter as requested
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
6. **Hidden Elements**: Topic explanations hidden on mobile for cleaner layout
7. **Improved Alignment**: Better spacing, centered content, and organized button layouts
8. **Mobile-Optimized Modals**: Full-width buttons and improved touch interactions

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

## 🔄 Recent Updates

### Calendar & Modal Fixes
- **Separate Calendar States**: Fixed dual calendar issue by using separate state for current topic vs. list topics
- **Click-Outside Functionality**: Added automatic closing of calendars and note modals when clicking outside
- **Mutual Exclusion**: Opening one calendar/modal now automatically closes others
- **Improved UX**: Better interaction flow with proper state management

### Height Optimization
- **Current Topic Card**: Reduced height through optimized padding and spacing
- **Compact Design**: More efficient use of vertical space while maintaining functionality

### Complete Functionality Removal
- **Current Topic Section**: Removed both bookmark and calendar/reminder functionality
- **Ultra-clean Interface**: Focus purely on learning flow (assessment, resources, quiz)
- **List Functionality**: All bookmark and reminder features available in the topics list

This refactoring provides a solid foundation for future enhancements while maintaining all existing functionality and significantly improving the mobile user experience.