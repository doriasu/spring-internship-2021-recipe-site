import { FC, useEffect, useState } from "react";
import {
	global_bg_color,
	global_img_bg_color,
	global_layout,
	mainProps,
	Recipe,
} from "../lib/recipe";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
export const SearchBar: FC = () => {
	const [searchtext, setSearchtext] = useState("");
	const [searchresult, setSearchresult] = useState("");
	const [recipes, setRecipes] = useState<Recipe[] | null>(null);
	const router = useRouter();
	return (
		<div>
			<Link href="/" passHref>
				<div className="container mx-auto h-16">レシピページ</div>
			</Link>
			<div className="text-center container　">
				<input
					value={searchtext}
					onChange={(event) => {
						setSearchtext(event.target.value);
					}}
					type="search"
					name="serch"
					placeholder="Search"
					className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none　border-solid border-4 border-gray-600"
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							router.push("/search/" + searchtext);
						}
					}}
				/>
			</div>
		</div>
	);
};
const mainPage: FC<mainProps> = (props) => {
	const [recipes, setRecipes] = useState<Recipe[]>(props.recipes);
	const router = useRouter();
	const [pagenum, setPagenum] = useState<number>(props.num);
	useEffect(() => {
		setPagenum(props.num ? props.num : 1);
		setRecipes(props.recipes);
	}, [props]);
	return (
		<div className="bg-red-50 font-mono">
			<meta property="og:title" content="Recipe Servoce" />
			<meta property="og:type" content="website" />
			<meta
				property="og:url"
				content="https://takuro-spring-internship-2021-recipe-site.vercel.app/"
			/>
			<meta
				property="og:image"
				content={props.recipes[0].image_url}
			/>
			<div className="ml-4 mr-4">
				<SearchBar />
				<br />
				<div className="text-2xl">
					<b>新着レシピ</b>
				</div>
				<br />
				<div className="grid grid-cols-2 gap-2">
					{recipes
						? recipes.map((r) => {
								return r.image_url ? (
									<Link
										key={r.id}
										href={"/recipes/" + r.id}
										passHref
									>
										<div className="border border-black rounded-2xl bg-gray-200">
											<img
												className="rounded-2xl"
												src={r.image_url}
											/>
											<div>{r.title}</div>
										</div>
									</Link>
								) : null;
						  })
						: null}
				</div>
				<br />
				<div className="grid grid-cols-2">
					{pagenum > 1 ? (
						<button
							onClick={() => {
								if (pagenum > 1) {
									router.push({
										pathname: "",
										query: { num: pagenum - 1 },
									});
								}
							}}
						>
							Prev
						</button>
					) : (
						<div></div>
					)}
					<button
						onClick={() => {
							router.push({
								pathname: "",
								query: { num: pagenum + 1 },
							});
						}}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const query = context.query.num;
	let num: number | null = +query;
	const base_url = new URL("https://internship-recipe-api.ckpd.co/recipes");
	if (num && num > 1) {
		base_url.searchParams.set("page", String(num));
	}
	const res = await fetch(base_url.toString(), {
		headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
	});
	let recipes = await res.json();
	recipes = recipes.recipes as Recipe[];
	return {
		props: {
			recipes: recipes,
			num: num?num:1,
		},
	};
};
export default mainPage;
