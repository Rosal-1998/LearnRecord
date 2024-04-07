# 定义计算RepVGGBlock的参数量的函数
def calc_repvgg_block_params(in_channels, out_channels, kernel_size=3, include_identity=True):
    # 3x3卷积参数量
    conv3x3_params = out_channels * (in_channels * kernel_size * kernel_size)
    print(conv3x3_params)
    # 1x1卷积参数量
    conv1x1_params = out_channels * in_channels
    print(conv1x1_params)
    # BN参数量 (每个输出通道有两个参数，即scale和shift)
    bn_params = 2 * out_channels
    print(bn_params)
    # 恒等映射参数量（只有BN，没有卷积参数）
    identity_params = bn_params if include_identity else 0
    print(identity_params)
    # 总参数量：3x3卷积 + 1x1卷积 + BN（两者） + 可选的恒等映射BN
    total_params = conv3x3_params + conv1x1_params + 2 * bn_params + identity_params
    return total_params

# 第一步RepVGGBlock (k=3, s=2, c=32)，对每个颜色通道
step1_params_per_channel = calc_repvgg_block_params(1, 32, include_identity=False)  # 输入输出通道数不同，不考虑恒等映射

# 第二步中的RepVGGBlock，对每个颜色通道进行n次处理，n=3
print('---1---')
step2_params_per_channel = calc_repvgg_block_params(32, 32) * 3  # 输入输出通道数相同，考虑恒等映射
print('---2---')
# 由于有3个颜色通道，我们需要乘以3
total_train_params = (step1_params_per_channel + step2_params_per_channel) * 3

# 推理时，每个RepVGGBlock只有一个等效的3x3卷积和BN，忽略恒等映射的参数（因为已经合并到3x3卷积中）
step1_params_per_channel_infer = 32 * (1 * 3 * 3) + 2 * 32  # 只有3x3卷积和BN
step2_params_per_channel_infer = 32 * (32 * 3 * 3) + 2 * 32  # 只有3x3卷积和BN
print(step1_params_per_channel)
print(step2_params_per_channel)
total_infer_params_per_channel = step1_params_per_channel_infer + step2_params_per_channel_infer * 3
total_infer_params = total_infer_params_per_channel * 3

print(total_train_params)
print(total_infer_params)