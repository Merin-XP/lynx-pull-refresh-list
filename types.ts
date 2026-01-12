import { ReactNode } from 'react';

/**
 * PullRefreshList 组件 Props
 *
 * 一个支持下拉刷新和上拉加载的列表组件
 */
export interface PullRefreshListProps<T> {
  // ===== 核心功能 =====

  /**
   * 列表数据数组
   */
  data: T[];

  /**
   * 渲染每一项的函数
   */
  renderItem: (item: T, index: number) => ReactNode;

  /**
   * 提取每一项的唯一 key
   */
  keyExtractor: (item: T, index: number) => string | number;

  /**
   * 下拉刷新回调函数
   * 返回 Promise，刷新完成后自动收起指示器
   */
  onRefresh?: () => Promise<void>;

  // ===== 布局配置 =====

  /**
   * 列表布局类型
   * - 'single': 单列列表
   * - 'flow': 瀑布流布局（多列）
   */
  listType?: 'single' | 'flow';

  /**
   * 瀑布流列数（仅当 listType='flow' 时生效）
   * @default 3
   */
  spanCount?: number;

  /**
   * 列表项主轴间距（如 "9px"）
   */
  listMainAxisGap?: string;

  /**
   * 列表项副轴间距（如 "8px"）
   */
  listCrossAxisGap?: string;

  // ===== 头部/尾部 =====

  /**
   * 头部组件（如筛选面板、搜索框等）
   * 会作为列表的第一项，占据全宽
   */
  headerComponent?: ReactNode;

  /**
   * 头部组件的高度（单位：px）
   * 用于判断触摸位置，防止在头部区域触发下拉刷新
   */
  headerHeight?: number;

  /**
   * 空状态组件
   * 当 data.length === 0 时显示
   */
  emptyComponent?: ReactNode;

  /**
   * 尾部组件（可选）
   */
  footerComponent?: ReactNode;

  // ===== 分页加载 =====

  /**
   * 加载更多回调函数
   * 滚动到底部时触发
   */
  onLoadMore?: () => void;

  /**
   * 是否还有更多数据
   * 为 false 时不会触发 onLoadMore
   */
  hasMoreData?: boolean;

  /**
   * 触发加载更多的阈值（剩余多少项时触发）
   * @default 3
   */
  lowerThresholdItemCount?: number;

  // ===== 滚动事件 =====

  /**
   * 滚动事件回调
   */
  onScroll?: (event: any) => void;

  /**
   * 滚动到边缘事件回调
   */
  onScrollToEdge?: (event: any) => void;

  // ===== 样式定制 =====

  /**
   * 容器样式
   */
  style?: Record<string, any>;

  /**
   * 列表样式
   */
  listStyle?: Record<string, any>;

  // ===== 下拉刷新配置 =====

  /**
   * 触发刷新的下拉距离阈值（单位：px）
   * @default 60
   */
  pullThreshold?: number;

  /**
   * 下拉阻尼系数（0-1 之间，值越小阻力越大）
   * @default 0.4
   */
  damping?: number;

  /**
   * 刷新指示器高度（单位：px）
   * @default 50
   */
  loadingHeight?: number;

  /**
   * 自定义刷新图标路径
   */
  refreshIcon?: string;
}
