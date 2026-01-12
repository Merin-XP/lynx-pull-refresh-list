/**
 * PullRefreshList - 通用下拉刷新列表组件
 *
 * 支持下拉刷新、上拉加载、单列/多列瀑布流布局
 */

import { useRef, useState, useCallback } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';
import type { PullRefreshListProps } from './types';
import {
  DEFAULT_PULL_THRESHOLD,
  DEFAULT_DAMPING,
  DEFAULT_LOADING_HEIGHT,
  DEFAULT_SPAN_COUNT,
  DEFAULT_LOWER_THRESHOLD_ITEM_COUNT,
  MIN_PULL_DISTANCE,
} from './constants';
import refreshIconSrc from './assets/loading.png';
import './PullRefreshList.css';

/// <reference types="@lynx-js/types" />

export function PullRefreshList<T>({
  // 核心功能
  data,
  renderItem,
  keyExtractor,
  onRefresh,

  // 布局配置
  listType = 'flow',
  spanCount = DEFAULT_SPAN_COUNT,
  listMainAxisGap = '9px',
  listCrossAxisGap = '8px',

  // 头部/尾部
  headerComponent,
  headerHeight = 0,
  emptyComponent,
  footerComponent,

  // 分页加载
  onLoadMore,
  hasMoreData = true,
  lowerThresholdItemCount = DEFAULT_LOWER_THRESHOLD_ITEM_COUNT,

  // 滚动事件
  onScroll,
  onScrollToEdge,

  // 样式定制
  style,
  listStyle,

  // 下拉刷新配置
  pullThreshold = DEFAULT_PULL_THRESHOLD,
  damping = DEFAULT_DAMPING,
  loadingHeight = DEFAULT_LOADING_HEIGHT,
  refreshIcon = refreshIconSrc,
}: PullRefreshListProps<T>) {
  const listRef = useRef<any>(null);

  // 下拉刷新相关状态
  const [pullStartY, setPullStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [indicatorHeight, setIndicatorHeight] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [iconRotation, setIconRotation] = useState(0);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [iconClassName, setIconClassName] = useState('');
  const [touchStartedInHeader, setTouchStartedInHeader] = useState(false);

  // ===== 触摸事件处理 =====

  const handleTouchStart = useCallback((event: any) => {
    if (!isAtTop || isLoadingState || !onRefresh) {
      return;
    }

    const touches = event.detail?.touches || event.touches;
    if (touches && touches[0]) {
      const touchY = touches[0].clientY;

      // 检查触摸位置是否在 header 区域内
      if (headerHeight > 0 && touchY < headerHeight) {
        setTouchStartedInHeader(true);
        return;
      }

      // 触摸在有效区域，重置标记并记录位置
      setTouchStartedInHeader(false);
      setPullStartY(touchY);
    }
  }, [isAtTop, isLoadingState, onRefresh, headerHeight]);

  const handleTouchMove = useCallback((event: any) => {
    // 如果触摸从 header 区域开始，完全忽略这次手势
    if (touchStartedInHeader) {
      return;
    }

    if (isLoadingState || !onRefresh) {
      return;
    }

    const touches = event.detail?.touches || event.touches;
    if (!touches || !touches[0]) {
      return;
    }

    const touch = touches[0];
    const deltaY = touch.clientY - pullStartY;

    // 如果还没开始下拉，检查是否应该开始
    if (!isPulling) {
      // 必须在顶部才能开始下拉
      if (!isAtTop) {
        return;
      }

      // 只有明确的下拉手势（向下且超过阈值）才开始拦截
      if (deltaY > MIN_PULL_DISTANCE) {
        setIsPulling(true);
      } else {
        // 向上滑动或距离不够，不拦截，让列表自然滚动
        return;
      }
    }

    // 到这里，isPulling 肯定是 true，继续处理下拉逻辑
    if (deltaY > 0) {
      // 下拉中，指示器跟随手指
      const distance = deltaY * damping;

      setPullDistance(distance);

      // 更新指示器高度
      const height = Math.min(distance, 100);
      setIndicatorHeight(height);

      // 更新图标旋转角度
      const rotation = (distance / 100) * 360;
      setIconRotation(rotation);
    } else {
      // 用户往上推超过起始点（deltaY <= 0）
      // 只收起指示器，但保持 isPulling=true，继续拦截触摸，防止列表滚动
      setPullDistance(0);
      setIndicatorHeight(0);
      setIconRotation(0);
      // 注意：不取消 isPulling 状态，等 touchend 时再取消
    }
  }, [touchStartedInHeader, isPulling, isLoadingState, pullStartY, onRefresh, damping, isAtTop]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || isLoadingState || !onRefresh) {
      return;
    }

    setIsPulling(false);
    const currentDistance = pullDistance;

    if (currentDistance >= pullThreshold) {
      // 达到阈值，触发刷新
      setIndicatorHeight(loadingHeight);
      setIconClassName('spinning');
      setIsLoadingState(true);

      await onRefresh();

      // 开始重置
      setIndicatorHeight(0);

      // 延迟300ms再重置其他状态，让图标在收起过程中继续旋转
      setTimeout(() => {
        setIconRotation(0);
        setPullDistance(0);
        setIsLoadingState(false);
        setIconClassName('');
      }, 300); // 匹配过渡动画时长
    } else {
      // 未达到阈值，回弹
      setIndicatorHeight(0);
      setIconRotation(0);
      setPullDistance(0);
    }
  }, [isPulling, isLoadingState, pullDistance, onRefresh, pullThreshold, loadingHeight]);

  // ===== 滚动事件处理 =====

  const handleScrollToTop = useCallback(() => {
    setIsAtTop(true);
  }, []);

  const handleScrollEvent = useCallback((event: any) => {
    const scrollTop = event.detail?.scrollTop || 0;

    if (scrollTop > 10) {
      setIsAtTop(false);
    }

    if (onScroll) {
      onScroll(event);
    }
  }, [onScroll]);

  const handleScrollToLower = useCallback((e: any) => {
    // 只有在有更多数据时才调用 onLoadMore
    if (hasMoreData && onLoadMore) {
      onLoadMore();
    }
  }, [hasMoreData, onLoadMore]);

  // ===== 样式合并 =====

  const containerStyle = {
    ...styles.touchContainer,
    ...style,
  };

  const finalListStyle = {
    ...styles.listContainer,
    listMainAxisGap,
    listCrossAxisGap,
    ...listStyle,
  };

  return (
    <view
      style={containerStyle}
      bindtouchstart={onRefresh ? handleTouchStart : undefined}
      bindtouchmove={onRefresh ? handleTouchMove : undefined}
      bindtouchend={onRefresh ? handleTouchEnd : undefined}
    >
      <list
        ref={listRef}
        style={finalListStyle}
        list-type={listType}
        span-count={listType === 'flow' ? spanCount : 1}
        scroll-orientation="vertical"
        bounces={true}
        enable-scroll={!isPulling}
        lower-threshold-item-count={lowerThresholdItemCount}
        bindscroll={onRefresh ? handleScrollEvent : onScroll}
        bindscrolltoupper={(e) => {
          if (onRefresh) {
            handleScrollToTop();
          } else {
            if (onScroll) onScroll(e);
          }
          onScrollToEdge?.(e);
        }}
        bindscrolltolower={handleScrollToLower}
      >
        {/* 头部组件 */}
        {headerComponent && (
          <list-item
            key="header"
            item-key="header"
            full-span={true}
            style={{ marginLeft: '-9px', marginRight: '-9px' }}
          >
            {headerComponent}
          </list-item>
        )}

        {/* 下拉刷新指示器 */}
        {onRefresh && (
          <list-item
            key="pull-refresh-indicator"
            item-key="pull-refresh-indicator"
            full-span={true}
            recyclable={false}
          >
            <view
              style={{
                ...styles.pullRefreshIndicator,
                height: `${indicatorHeight}px`,
                transition: (isLoadingState || indicatorHeight === 0)
                  ? 'height 0.3s ease-in-out'
                  : 'none',
              }}
            >
              <image
                src={refreshIcon}
                class={iconClassName}
                style={{
                  ...styles.refreshIcon,
                  ...(isLoadingState ? {} : { transform: `rotate(${iconRotation}deg)` }),
                }}
              />
            </view>
          </list-item>
        )}

        {/* 内容列表 */}
        {data.length > 0 ? (
          data.map((item, index) => {
            const key = keyExtractor(item, index);
            return (
              <list-item
                key={key}
                item-key={String(key)}
              >
                {renderItem(item, index)}
              </list-item>
            );
          })
        ) : (
          emptyComponent && (
            <list-item
              key="empty-state"
              item-key="empty-state"
              full-span={true}
              recyclable={false}
            >
              {emptyComponent}
            </list-item>
          )
        )}

        {/* 尾部组件 */}
        {footerComponent && (
          <list-item
            key="footer"
            item-key="footer"
            full-span={true}
            recyclable={false}
          >
            {footerComponent}
          </list-item>
        )}
      </list>
    </view>
  );
}

const styles = {
  touchContainer: {
    width: '100%',
    height: '100%',
  },
  pullRefreshIndicator: {
    width: '100%',
    height: '0px',
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'flex-end' as const,
    backgroundColor: '#ffffff',
    overflow: 'hidden' as const,
  },
  refreshIcon: {
    width: '20px',
    height: '20px',
    marginBottom: '7px',
  },
  listContainer: {
    width: '100%',
  height: '100%',
    paddingLeft: '9px',
    paddingRight: '9px',
    paddingBottom: '20px',
  },
};
