# PullRefreshList 组件

一个支持下拉刷新、上拉加载的通用列表组件，适用于 Lynx 框架。

## 特性

- ✅ 下拉刷新
- ✅ 上拉加载更多
- ✅ 单列/多列瀑布流布局
- ✅ 自定义头部组件
- ✅ 空状态支持

## 基础用法

### 简单列表（带下拉刷新）

```tsx
import { PullRefreshList } from './components/PullRefreshList';

<PullRefreshList
  data={items}
  renderItem={(item) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  onRefresh={async () => {
    await fetchData();
  }}
/>
```

### 瀑布流布局（三列）

```tsx
<PullRefreshList
  data={products}
  renderItem={(item) => <ProductCard item={item} />}
  keyExtractor={(item) => item.id}
  listType="flow"
  spanCount={3}
  onRefresh={async () => {
    await loadProducts();
  }}
/>
```

### 带头部筛选器

```tsx
<PullRefreshList
  data={contentList}
  renderItem={(item) => <ContentCard item={item} />}
  keyExtractor={(item) => `item-${item.id}`}

  // 头部组件
  headerComponent={<FilterPanel {...filterProps} />}
  headerHeight={250}  // 头部高度，用于触摸排除

  // 下拉刷新
  onRefresh={async () => {
    await loadContent();
  }}

  // 分页加载
  onLoadMore={loadMore}
  hasMoreData={hasMore}
/>
```

### 完整示例

```tsx
<PullRefreshList
  // 核心数据
  data={contentList}
  renderItem={(item, index) => <ContentCard item={item} index={index} />}
  keyExtractor={(item) => `item-${item.id}`}

  // 布局配置
  listType="flow"
  spanCount={3}
  listMainAxisGap="9px"
  listCrossAxisGap="8px"

  // 头部
  headerComponent={
    <FilterPanel
      categories={categories}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  }
  headerHeight={250}

  // 空状态
  emptyComponent={<EmptyState text="暂无数据" />}

  // 下拉刷新
  onRefresh={async () => {
    await loadContent(false);
  }}

  // 分页加载
  onLoadMore={handleLoadMore}
  hasMoreData={hasMore}
  lowerThresholdItemCount={3}

  // 滚动事件
  onScroll={handleScroll}
  onScrollToEdge={handleScrollToEdge}

  // 自定义配置
  pullThreshold={60}
  damping={0.4}
  loadingHeight={50}
/>
```

## Props 说明

### 核心功能

| Props | 类型 | 必需 | 说明 |
|-------|------|------|------|
| `data` | `T[]` | ✅ | 列表数据数组 |
| `renderItem` | `(item: T, index: number) => ReactNode` | ✅ | 渲染每一项的函数 |
| `keyExtractor` | `(item: T, index: number) => string \| number` | ✅ | 提取每一项的唯一 key |
| `onRefresh` | `() => Promise<void>` | ❌ | 下拉刷新回调 |

### 布局配置

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `listType` | `'single' \| 'flow'` | `'flow'` | 列表布局类型 |
| `spanCount` | `number` | `3` | 瀑布流列数 |
| `listMainAxisGap` | `string` | `'9px'` | 主轴间距 |
| `listCrossAxisGap` | `string` | `'8px'` | 副轴间距 |

### 头部/尾部

| Props | 类型 | 说明 |
|-------|------|------|
| `headerComponent` | `ReactNode` | 头部组件 |
| `headerHeight` | `number` | 头部高度（用于触摸排除） |
| `emptyComponent` | `ReactNode` | 空状态组件 |
| `footerComponent` | `ReactNode` | 尾部组件 |

### 分页加载

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `onLoadMore` | `() => void` | - | 加载更多回调 |
| `hasMoreData` | `boolean` | `true` | 是否还有更多数据 |
| `lowerThresholdItemCount` | `number` | `3` | 触发加载更多的阈值 |

### 滚动事件

| Props | 类型 | 说明 |
|-------|------|------|
| `onScroll` | `(event: any) => void` | 滚动事件回调 |
| `onScrollToEdge` | `(event: any) => void` | 滚动到边缘回调 |

### 下拉刷新配置

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `pullThreshold` | `number` | `60` | 触发刷新的阈值（px） |
| `damping` | `number` | `0.4` | 阻尼系数（0-1） |
| `loadingHeight` | `number` | `50` | 指示器高度（px） |
| `refreshIcon` | `string` | - | 自定义刷新图标路径 |

## 技术细节

### 下拉刷新指示器位置

- **无 headerComponent**：指示器从列表最顶端出现
- **有 headerComponent**：指示器从 header 下方出现

### 触摸区域处理

通过 `headerHeight` 参数可以排除头部区域的触摸事件，防止与头部组件的交互冲突。
