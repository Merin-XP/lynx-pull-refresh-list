/**
 * 下拉刷新默认配置常量
 */

/**
 * 触发刷新的下拉距离阈值（单位：px）
 */
export const DEFAULT_PULL_THRESHOLD = 60;

/**
 * 下拉阻尼系数（控制下拉的阻力大小）
 * 取值范围：0-1，值越小阻力越大
 */
export const DEFAULT_DAMPING = 0.4;

/**
 * 刷新指示器的固定高度（单位：px）
 */
export const DEFAULT_LOADING_HEIGHT = 50;

/**
 * 默认瀑布流列数
 */
export const DEFAULT_SPAN_COUNT = 3;

/**
 * 默认加载更多阈值（剩余多少项时触发）
 */
export const DEFAULT_LOWER_THRESHOLD_ITEM_COUNT = 3;

/**
 * 最小下拉距离阈值（单位：px）
 * 只有超过此距离才认为是下拉手势，避免误判普通滚动
 */
export const MIN_PULL_DISTANCE = 5;
