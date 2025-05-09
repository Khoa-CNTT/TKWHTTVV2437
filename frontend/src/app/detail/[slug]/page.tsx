import { IoLocationSharp } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { MdPets } from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaPerson } from "react-icons/fa6";
import HighlightProperty from "@/components/container/HighlightProperty";
import ReviewContainer from "@/components/container/ReviewContainer";
import apisProperty from "@/apis/property";
import apisReview from "@/apis/review";
import { ratingText } from "@/helper/ratingText";
import AnmenityContainer from "@/components/container/AmenityContainer";
import ListRoomContainer from "@/components/container/ListRoomContainer";
import ChooseDateContainer from "@/components/container/ChooseDateContainer";
import ShowDescriptionEditext from "@/components/content/ShowDescriptionEditText";
import ContainerRecomendCity from "@/components/container/ContainerRecomendCity";
import { IProperty } from "@/app/types/property";
import ViewReviewButton from "@/components/button/ViewReviewButton";
import Footer from "@/components/header/Footer";
import type { Metadata, ResolvingMetadata } from "next";

interface IProps {
  params: { slug: string };
}

interface IImage {
  image: string;
  id: string;
}

export async function generateMetadata(
  { params }: IProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const property = await apisProperty.getPropertyBySlug(slug);

  return {
    title: `${property?.data?.name}`,
    description: property?.overview,
  };
}

const DetailPage = async (props: IProps) => {
  const { params } = props;

  const property = await apisProperty.getPropertyBySlug(params.slug);
  const rating = await apisReview.getReviewByProperty(property.data.id);
  const reviews = await apisReview.getListReviewByPropertyId(property.data.id);
  const properties = await apisProperty.getListProperty({
    city: property.data.propertyAddress.city,
  });

  return (
    <div>
      <div className="pt-4 w-[1260px] mx-auto">
        <div className="grid grid-cols-2 gap-1">
          <img
            className="w-full h-[418px] rounded-md"
            src={property.data?.images[0]?.image}
            alt="anh"
          />

          <div className="grid grid-cols-2 gap-1">
            {property.data.images.map(
              (item: IImage, index: number) =>
                index > 0 && (
                  <img
                    key={index}
                    className="w-full h-[207px] rounded-md"
                    src={item.image}
                    alt=""
                  />
                )
            )}
          </div>
        </div>

        <div className="flex p-4 gap-5">
          <div className="mt-2 flex-7">
            <h2 className="font-semibold text-2xl">{property.data.name}</h2>

            <div className="flex items-center gap-1 mt-1">
              <IoLocationSharp size={22} className="text-blue-600" />
              <p className="text-sm">{`${property.data.propertyAddress.street}, ${property.data.propertyAddress.district}, ${property.data.propertyAddress.city}, ${property.data.propertyAddress.country}`}</p>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-md text-sm font-medium text-white bg-green-800">
                  {rating.data.averageRating || 0}
                </div>
                <span className="font-semibold text-xl">
                  {ratingText(rating.data.averageRating)}
                </span>
              </div>

              <ViewReviewButton
                propertyId={property.data.id}
                avgRating={rating.data.averageRating || 0.0}
                reviewCount={rating.data.reviewCount}
                image={property.data.images[0].image}
                name={property.data.name}
                advertising={property.data.advertising}
                city={property.data.propertyAddress.city}
                price={property.data.price}
                slug={property.data.slug}
              />
            </div>

            <div className="mt-4">
              <ShowDescriptionEditext description={property.data.description} />
            </div>

            <div>
              <h5 className="mt-4 font-semibold text-lg">
                Các tiện nghi được ưa chuộng nhất
              </h5>
              <AnmenityContainer amenities={property.data.amenities} />
            </div>

            <div>
              <h5 className="mt-8 font-semibold text-lg">Thông tin phòng</h5>
              <ChooseDateContainer />
              <ListRoomContainer propertyId={property.data.id} />
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-xl">Thông tin chung</h4>

              <div className="border-[1px] border-gray-300 rounded-md p-8 mt-4">
                <div className="flex pb-4">
                  <div className="flex items-center gap-2 flex-3">
                    <CiLogin size={25} />
                    <p className="font-semibold">Nhận phòng</p>
                  </div>

                  <div className="flex-7">
                    <p className="text-sm">Từ 14:00</p>
                    <p className="text-sm">
                      Khách được yêu cầu xuất trình giấy tờ tùy thân có ảnh và
                      thẻ tín dụng lúc nhận phòng
                    </p>
                  </div>
                </div>

                <div className="flex border-t border-gray-300 pt-10 mt-4 pb-4">
                  <div className="flex items-center gap-2 flex-3">
                    <CiLogout size={25} />
                    <p className="font-semibold">Trả phòng</p>
                  </div>

                  <div className="flex-7">
                    <p className="text-sm">Đến 12:00</p>
                  </div>
                </div>

                <div className="flex border-t border-gray-300 pt-10 mt-4 pb-4">
                  <div className="flex items-center gap-2 flex-3">
                    <FaPerson size={25} />
                    <p className="font-semibold">Độ tuổi</p>
                  </div>

                  <div className="flex-7">
                    <p className="text-sm">
                      Không có yêu cầu về độ tuổi khi nhận phòng
                    </p>
                  </div>
                </div>

                <div className="flex border-t border-gray-300 pt-10 mt-4">
                  <div className="flex items-center gap-2 flex-3">
                    <MdPets size={25} />
                    <p className="font-semibold">Vật nuôi</p>
                  </div>

                  <div className="flex-7">
                    <p className="text-sm">Vật nuôi không được phép</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-3 ralative">
            <div className="sticky top-0">
              <HighlightProperty highlights={property.data.highlights} />
            </div>
          </div>
        </div>

        {reviews?.data?.length > 0 && (
          <div className="mt-4 p-4">
            <h4 className="font-semibold text-xl">Đánh giá</h4>

            <div>
              <div className="mt-4">
                <p className="text-4xl text-green-700 font-semibold">
                  {rating.data.averageRating || 0}/5
                </p>
                <p className="font-semibold">
                  {ratingText(rating.data.averageRating)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-600">
                  <p>{rating.data.reviewCount} Reviews</p>
                  <RiErrorWarningLine />
                </div>
              </div>

              <div className="mt-4">
                <ReviewContainer
                  reviews={reviews.data}
                  propertyId={property.data.id}
                  avgRating={rating.data.averageRating}
                  reviewCount={rating.data.reviewCount}
                />
              </div>
            </div>
          </div>
        )}

        {properties?.data?.filter(
          (item: IProperty) => item.id !== property?.data?.id
        ).length > 0 && (
          <div className="mt-8">
            <ContainerRecomendCity
              properties={properties?.data?.filter(
                (item: IProperty) => item?.id !== property?.data?.id
              )}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DetailPage;
