1. 时间框：小时， 分钟
2. 增加小时
3. 减小小时
4. 增加分钟
5. 减小时间
6. 前一个时间要小于后一个时间
7. 如果后一个时间小于后一个时间，则弹出提示 isVaild
8. 开门时间，关门时间 

参数:
    step: number 增加的幅度
    isValid: boolean  设置的时间是否有效
    openTime: string  开业时间
    closeTime: string 关门时间
    increaseHour: function 增加小时 1个小时一个小时增加
    decreaseHour: function 减小小时
    increaseMinute: function 增加分钟 5分钟的step
    decreaseMinute: function 减小分钟
    hour: string 必填 小时 00-23
    minute: string 必填 分钟 00-59 