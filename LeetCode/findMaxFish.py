from typing import List

class Solution:
    def findPath(self,grid,i,j):
       print(i,j)

    def findMaxFish(self, grid: List[List[int]]) -> int:
        # 长m 高n
        m ,n = len(grid),len(grid[0])
        print(grid[0][0])
        # 遍历所有网格，找出海地
        for index, cow in enumerate(grid):
          for indexCow, rol in enumerate(cow):
             if rol != 0:
                # 找出路径,并记录
                self.findPath(grid,index,indexCow)
                print(index,indexCow)
      
    
       



solution = Solution()

Pool = solution.findMaxFish(grid=[[0, 2, 1, 0], [4, 0, 0, 3], [1, 0, 0, 4], [0, 3, 2, 0]])

