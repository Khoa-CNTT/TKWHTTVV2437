const { Op,fn, col } = require("sequelize");
const { v4 } = require("uuid");
require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../models");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const { get } = require("../routes/AdminRouter");

const loginAdmin = (admin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = admin;
    if (!email || !password) {
      resolve({ status: "ERR", msg: "Email and password are required" });
      return;
    }
    try {
      const checkAdmin = await db.User.findOne({
        where: { email, role: "1" },
        raw: true,
      });
      if (checkAdmin === null) {
        resolve({ status: "ERR", msg: "The admin is not defined" });
        return;
      }
      const isCorrectPassword = bcrypt.compareSync(
        password,
        checkAdmin.password
      );
      if (!isCorrectPassword) {
        resolve({
          status: "ERR",
          msg: "The password or admin is incorrect",
        });
        return;
      }
      const access_token = await generalAccessToken({
        id: checkAdmin.id,
        role: checkAdmin.role,
      });
      const refresh_token = await generalRefreshToken({
        id: checkAdmin.id,
        role: checkAdmin.role,
      });
      resolve({
        status: "OK",
        msg: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const registerOwner = async (ownerData) => {
  try {
    const hashedPassword = await bcrypt.hash(ownerData.password, 10);
    const response = await db.User.create({
      id: v4(),
      ...ownerData,
      password: hashedPassword,
      role: "2",
    });
    return {
      status: "OK",
      msg: "Owner registered successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    // Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email: userData.email }, { phone: userData.phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error("Email đã tồn tại.");
      }
      if (existingUser.phone === userData.phone) {
        throw new Error("Số điện thoại đã tồn tại.");
      }
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Tạo người dùng mới
    const response = await db.User.create({
      id: v4(),
      ...userData,
      password: hashedPassword,
    });

    return { status: "OK", msg: "User created successfully", data: response };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    // Kiểm tra xem email hoặc số điện thoại đã tồn tại với User khác
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email: userData.email }, { phone: userData.phone }],
        id: { [Op.ne]: id }, // Loại trừ User hiện tại
      },
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error("Email đã tồn tại.");
      }
      if (existingUser.phone === userData.phone) {
        throw new Error("Số điện thoại đã tồn tại.");
      }
    }

    // Cập nhật thông tin người dùng
    const response = await db.User.update(userData, { where: { id } });

    return { status: "OK", msg: "User updated successfully", data: response };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await db.User.destroy({ where: { id} });
    return { status: "OK", msg: "User deleted successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const listUsers = async (role) => {
  try {
    const users = await db.User.findAll();
    return { status: "OK", data: users };
  } catch (error) {
    throw error;
  }
};
const approveOwner = async (id) => {
  try {
    const response = await db.User.update(
      { status: "Active" },
      { where: { id } }
    );
    return { status: "OK", msg: "Account Active successfully", data: response };
  } catch (error) {
    throw error;
  }
};
const lockAccount = async (id) => {
  try {
    const response = await db.User.update(
      { status: "Locked" },
      { where: { id } }
    );
    return { status: "OK", msg: "Account locked successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const createCategory = async (categoryData) => {
  try {
    const response = await db.Category.create(categoryData);
    return {
      status: "OK",
      msg: "Category created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const response = await db.Category.update(categoryData, { where: { id } });
    return {
      status: "OK",
      msg: "Category updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await db.Category.destroy({ where: { id } });
    return {
      status: "OK",
      msg: "Category deleted successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listCategories = async () => {
  try {
    const categories = await db.Category.findAll();
    return { status: "OK", data: categories };
  } catch (error) {
    throw error;
  }
};

const createLocation = async (locationData) => {
  try {
    const response = await db.City.create(locationData);
    return {
      status: "OK",
      msg: "Location created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const updateLocation = async (id, locationData) => {
  try {
    const response = await db.City.update(locationData, { where: { id } });
    return {
      status: "OK",
      msg: "Location updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const deleteLocation = async (id) => {
  try {
    const response = await db.City.destroy({ where: { id } });
    return {
      status: "OK",
      msg: "Location deleted successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listLocations = async () => {
  try {
    const locations = await db.City.findAll();
    return { status: "OK", data: locations };
  } catch (error) {
    throw error;
  }
};

const createAmenity = async (amenityData) => {
  try {
    const response = await db.Amenity.create(amenityData);
    return {
      status: "OK",
      msg: "Amenity created successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const updateAmenity = async (id, amenityData) => {
  try {
    const response = await db.Amenity.update(amenityData, { where: { id } });
    return {
      status: "OK",
      msg: "Amenity updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const deleteAmenity = async (id) => {
  try {
    const response = await db.Amenity.destroy({ where: { id } });
    return {
      status: "OK",
      msg: "Amenity deleted successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listAmenities = async () => {
  try {
    const amenities = await db.Amenity.findAll();
    return { status: "OK", data: amenities };
  } catch (error) {
    throw error;
  }
};

const approveHomestay = async (id) => {
  try {
    const response = await db.Property.update(
      { status: "approved" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Homestay approved successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const rejectHomestay = async (id) => {
  try {
    const response = await db.Property.update(
      { status: "rejected" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Homestay rejected successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};


const createHomestay = async (data) => {
  try {
    const homestay = await db.Property.create({
      id: v4(),
      name: data.name,
      description: data.description,
      address: data.address,
      idUser: data.ownerId, // ID của chủ sở hữu
      idCategory: data.categoryId, // ID danh mục
      status: "pending", // Trạng thái mặc định
    });
    return { status: "OK", data: homestay };
  } catch (error) {
    throw error;
  }
};

const deleteHomestay = async (id) => {
  try {
    const response = await db.Property.destroy({ where: { id } });
    return { status: response ? "OK" : "ERR", msg: response ? "Deleted successfully" : "Not found" };
  } catch (error) {
    throw error;
  }
};




const updateHomestay = async (id, homestayData) => {
  try {
    const response = await db.Property.update(homestayData, { where: { id } });
    return {
      status: "OK",
      msg: "Homestay updated successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listHomestays = async (req, res) => {
  try {
    const homestays = await db.Property.findAll({
      attributes: [
        "id",
        "idUser",
        "idCategory",
        "idAddress",
        "name",
        "description",
        "createdAt",
        "updatedAt",
        "status",
      ], 
      include: [
       
        {
          model: db.ImageProperty,
          as: "images", // Alias đã định nghĩa trong model
          attributes: ["image"], // Chỉ lấy URL ảnh
        },
        {
          model: db.Room, // Đúng tên model Room
          as: "rooms", // Alias phải khớp với định nghĩa trong model
          attributes: ["price"], // Chỉ lấy giá phòng
        },
        {
          model: db.Address,
          as: "address",
          attributes: ["city"],
        },
        {
          model: db.Category,
          as: "category",
          attributes: ["name"], // Lấy tên loại từ Category
        },
      ],
    });

    // Kiểm tra nếu không có homestays
    if (!homestays || homestays.length === 0) {
      return res.status(404).json({ msg: "No homestays found" });
    }
return { status: "OK", data: homestays };   
    // res.status(200).json(homestays);
  } catch (error) {
    console.error("Error fetching homestays:", error);
    res.status(500).json({ msg: "Error fetching homestays" });
  }
};
const getListPropertiesByOwnerId = async (idUser) => {
  try {
    const properties = await db.Property.findAll({
      where: { idUser },
      attributes: [
        "id",
        "idUser",
        "idCategory",
        "idAddress",
        "name",
        "description",
        "createdAt",
        "updatedAt",
        "status",
      ], 
      include: [
       
        {
          model: db.ImageProperty,
          as: "images", // Alias đã định nghĩa trong model
          attributes: ["image"], // Chỉ lấy URL ảnh
        },
        {
          model: db.Room, // Đúng tên model Room
          as: "rooms", // Alias phải khớp với định nghĩa trong model
        },
        {
          model: db.Address,
          as: "address",
          attributes: ["city"],
        },
        {
          model: db.Category,
          as: "category",
          attributes: ["name"], // Lấy tên loại từ Category
        },
      ],
    });

    // Kiểm tra nếu không có homestays
    console.log("Properties fetched:", properties); // Log để kiểm tra dữ liệu trả về
    return { status: "OK", data: properties };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
const getListRoomByPropertyId = async (IdProperty) => {
  try {
    console.log("Fetching rooms for IdProperty:", IdProperty); // Log để kiểm tra giá trị IdProperty
    const rooms = await db.Room.findAll({
      where: { IdProperty }, // Điều kiện tìm kiếm
      attributes: ["id", "idProperty", "name","description","maxPerson" , "price","status", "createdAt", "updatedAt"],
      include: [
        {
          model: db.ImageRoom,
          as: "images", // Alias đã định nghĩa trong model
          attributes: ["image"], // Chỉ lấy URL ảnh
        },
        {
          model: db.Amenity,
          as: "amenities", // Alias đã định nghĩa trong model
          attributes: ["name"], // Lấy tên của amenities
        },
      ],
    });

    console.log("Rooms fetched:", rooms); // Log để kiểm tra dữ liệu trả về
    return { status: "OK", data: rooms };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
const createRoom = async (data) => {
  try {
    const room = await db.Room.create(data);
    return { status: "OK", data: room };
  } catch (error) {
    throw error;
  }
};

const updateRoom = async (id, data) => {
  try {
    const response = await db.Room.update(data, { where: { id } });
    return { status: "OK", msg: "Room updated successfully", data: response };
  } catch (error) {
    throw error;
  }
};

const deleteRoom = async (id) => {
  try {
    const response = await db.Room.destroy({ where: { id } });
    return { status: "OK", msg: "Room deleted successfully", data: response };
  } catch (error) {
    throw error;
  }
};
const listPayments = async () => {
  try {
      const payments = await db.Payment.findAll({
        attributes: [
          'id',
          'idReservation',
          'idUser',
          'paymentDate',
          'paymentMethod',
          'paymentStatus',
          'createdAt',
          'updatedAt'
        ],
        include: [
          {
            model: db.User, // Association với User
            as: 'Users',
            attributes: ['firstName', 'lastName', 'email'] // Chỉ lấy các trường cần
          },
          {
            model: db.Reservation,
            include: [{ 
              model: db.Room,
              as: 'Rooms',
            }],
            as: 'Reservations',
            attributes: ['totalPrice'] 
          }
        ]
      });
     // Không có include
    return { status: "OK", data: payments };
  } catch (error) {
    throw error;
  }
};

const refundPayment = async (id) => {
  try {
    const response = await db.Payment.update(
      { paymentStatus: "refunded" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Payment refunded successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const listBookings = async () => {
  try {
    const bookings = await db.Reservation.findAll({
      // Chỉ định rõ các trường cần lấy
      attributes: [
        'id',
        'idUser', 
        'idRoom',
        'firstName',
        'lastName',
        'email',
        'phone',
        'checkIndate',
        'checkOutdate',
        'numGuest',
        'totalPrice',
        'status',
        'createdAt'
      ],
    
    });
    
    return { status: "OK", data: bookings };
  } catch (error) {
    console.error("Error in listBookings:", error);
    throw new Error("Failed to retrieve bookings");
  }
};
const confirmBooking = async (id) => {
  try {
    const response = await db.Reservation.update(
      { status: "confirmed" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Booking confirmed successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (id) => {
  try {
    const response = await db.Reservation.update(
      { status: "Canceled" },
      { where: { id } }
    );
    return {
      status: "OK",
      msg: "Booking canceled successfully",
      data: response,
    };
  } catch (error) {
    throw error;
  }
};
const getStatistics = async (filter) => {
  const dateFormat = {
    day: '%Y-%m-%d',
    month: '%Y-%m',
    year: '%Y',
  }[filter] || '%Y-%m-%d';

  try {
    // Sửa thành db.User thay vì User
    const userStats = await db.User.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: { role: '3' }, // Giả sử role 3 là user thường
      group: ['date'],
      raw: true,
    });

    const ownerStats = await db.User.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: { role: '2' }, // Giả sử role 2 là owner
      group: ['date'],
      raw: true,
    });

    // Sửa thành db.Reservation
    const reservationStats = await db.Reservation.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['date'],
      raw: true,
    });

    const resultMap = {};

    const mergeData = (data, key) => {
      data.forEach(({ date, count }) => {
        if (!resultMap[date]) {
          resultMap[date] = { 
            date, 
            userCount: 0, 
            ownerCount: 0, 
            reservationCount: 0 
          };
        }
        resultMap[date][key] = parseInt(count, 10);
      });
    };

    mergeData(userStats, 'userCount');
    mergeData(ownerStats, 'ownerCount');
    mergeData(reservationStats, 'reservationCount');

    const result = Object.values(resultMap).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    return result;

  } catch (error) {
    console.error('Error in getStatistics:', error);
    throw error;
  }
};

module.exports = {
  loginAdmin,
  registerOwner,
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  lockAccount,
  approveOwner,
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  createLocation,
  updateLocation,
  deleteLocation,
  listLocations,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  listAmenities,
  approveHomestay,
  rejectHomestay,
  updateHomestay,
  createHomestay,
  deleteHomestay,
  listHomestays,
  getListRoomByPropertyId,
  getListPropertiesByOwnerId,
  createRoom,
  updateRoom,
  deleteRoom,
  listPayments,
  refundPayment,
  listBookings,
  confirmBooking,
  cancelBooking,
  getStatistics,
};
