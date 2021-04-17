 
 def sub(x, y):
    return x+y
 
 def move_right(self):

    new_position = self.position + np.array([0, 1])

    if self._check_collision(new_position, self.curr):
        self.position = new_position

import math

def rotate(origin, point, angle):
    ox, oy = origin
    px, py = point

    qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
    qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)
    return qx, qy

  def move_fast_down(self):

    new_position = self.position + np.array([1, 0])

    while self._check_collision(new_position, self.curr):
        self.position = new_position
        new_position = self.position + np.array([1, 0])

    return self._next_round()


def shift_pixel(image, dir, amount = 1):
    if dir == (0, 1):
        res = np.concatenate((image[amount:28,:], np.zeros((amount, image.shape[0]))), axis=0)
    if dir == (0, -1):
        res = np.concatenate((np.zeros((amount, image.shape[0])), image[:28-amount,:]), axis=0)
    if dir == (-1, 0):
        res = np.concatenate((image[:,amount:28], np.zeros((image.shape[0], amount))), axis=1)
    if dir == (1, 0):
        res = np.concatenate((np.zeros((image.shape[0], amount)), image[:,:28-amount]), axis=1)
    return res

