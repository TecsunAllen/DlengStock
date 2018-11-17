import { resMap } from '../utils/klineMap';

export function isCrossStar(kline) {
    const entityHeight = Math.abs(kline[resMap.openPrice] - kline[resMap.closePrice]);

    const lineHeight = Math.abs(kline[resMap.highPrice] - kline[resMap.lowPrice]);

    if (lineHeight / entityHeight > 2) return true;
    return false;
}